import { sequelize } from '@/database'
import Brand from '@/models/Brand'
import Gender from '@/models/Gender'
import Image from '@/models/Image'
import Product from '@/models/Product'
import ProductImage from '@/models/Product-Image'
import Sale from '@/models/Sale'
import SaleProduct from '@/models/Sale-Product'
import Size from '@/models/Size'
import User from '@/models/User'
import { GetById as GetSizeById } from '@/service/size'
import { type OrderDatesQuery, type PaginationQuery } from '@/types/queries'
import { type SizeSaleDTO } from '@/types/schemas'
import { NotFoundError, UnexpectedError } from '@/utils/errors'
import { getDateOrder } from '@/utils/sort-query'
import { Op, QueryTypes } from 'sequelize'

const excludeTimeStamps = ['createdAt', 'updatedAt', 'deletedAt']

interface PaginationWithOrder extends PaginationQuery {
  order?: OrderDatesQuery
}

export async function GetAll ({
  limit = 10,
  offset = 0,
  order = 'recents'
}: PaginationWithOrder) {
  const sortedOrder = getDateOrder({ order })

  const { count, rows: sales } = await Sale.findAndCountAll({
    attributes: { exclude: ['deletedAt'] },
    include: [
      { model: User, attributes: { exclude: ['deletedAt'] }, paranoid: false },
      {
        model: Size,
        paranoid: false,
        include: [{
          model: Product,
          paranoid: false,
          include: [
            { model: Brand, paranoid: false, attributes: { exclude: [...excludeTimeStamps, 'imageId', 'bannerId'] } },
            { model: Gender, paranoid: false, attributes: { exclude: excludeTimeStamps } },
            {
              model: ProductImage,
              attributes: { exclude: excludeTimeStamps },
              include: [{ model: Image, attributes: { exclude: excludeTimeStamps } }],
              paranoid: false
            }
          ]
        }]
      }
    ],
    offset,
    order: [sortedOrder],
    limit,
    paranoid: false
  })

  return { count, sales }
}

export async function GetById (saleId?: string) {
  const sale = await Sale.findByPk(saleId, {
    attributes: { exclude: ['deletedAt'] },
    include: [
      { model: User, attributes: { exclude: ['deletedAt'] }, paranoid: false },
      {
        model: Size,
        paranoid: false,
        include: [{
          model: Product,
          paranoid: false,
          include: [
            { model: Brand, paranoid: false, attributes: { exclude: [...excludeTimeStamps, 'imageId', 'bannerId'] } },
            { model: Gender, paranoid: false, attributes: { exclude: excludeTimeStamps } },
            {
              model: ProductImage,
              attributes: { exclude: excludeTimeStamps },
              include: [{ model: Image, attributes: { exclude: excludeTimeStamps } }],
              paranoid: false
            }
          ]
        }]
      }
    ],
    paranoid: false
  })

  return sale
}

export async function Create (userId: string, products: SizeSaleDTO[]) {
  const transaction = await sequelize.transaction()
  let totalPaid = 0
  const sale = await Sale.create({ userId, totalPaid }, { transaction })

  for (const productInfo of products) {
    const { sizeId, quantity } = productInfo
    const size = await GetSizeById(sizeId)

    if (size === null) {
      await transaction.rollback()
      throw new NotFoundError('Producto o tamaño no encontrado')
    }

    if (size.product === undefined) {
      await transaction.rollback()
      throw new NotFoundError('Producto no encontrado')
    }

    if (size.stock < quantity) {
      await transaction.rollback()
      throw new UnexpectedError('No hay suficiente stock')
    }

    const { product } = size

    const total = (product.price + size.extraPrice) * quantity

    const saleProduct = await SaleProduct.create({
      saleId: sale.saleId ?? '',
      sizeId: size.sizeId ?? '',
      originalPrice: product.price,
      extraPrice: size.extraPrice,
      quantity,
      total
    }, { transaction })

    console.log(saleProduct.toJSON())

    size.stock -= quantity
    totalPaid += total
    await size.save({ transaction })
  }

  await transaction.commit()
  await sale.update({ totalPaid })
  return sale
}

export async function GetTotalSalesAmount (
  { dateStart = new Date() }: { dateStart?: Date } = {}
) {
  const total = await Sale.sum('totalPaid', {
    where: {
      createdAt: {
        [Op.gte]: dateStart
      }
    }
  })
  return total ?? 0
}

interface GetTopSellingParams {
  dateStart?: Date
  dateEnd?: Date
}

interface GetTopSellingProductsParams extends GetTopSellingParams {
  order?: 'DESC' | 'ASC'
}

interface RowResponse {
  name: string
  totalSales: number
}

interface RowProducts extends RowResponse {
  productId: string
}

export async function GetTotalSales (
  { dateStart = new Date(), dateEnd = new Date() }: GetTopSellingParams = {}
) {
  const totalSales = await SaleProduct.sum('quantity', {
    where: {
      createdAt: {
        [Op.between]: [dateStart, dateEnd]
      }
    }
  })

  return totalSales
}

export async function GetTopSellingProducts (
  { dateStart = new Date(), dateEnd = new Date(), order = 'DESC' }: GetTopSellingProductsParams = {}
) {
  const topSellingProductsQuery = `
  SELECT p.product_id as productId, p.name, (
    SELECT IFNULL(SUM(sp.quantity), 0)
    FROM walkstyle.sale_products AS sp
    INNER JOIN walkstyle.sizes AS s
    ON sp.sizeId = s.size_id
    WHERE s.productId = p.product_id
    AND sp.createdAt BETWEEN :dateStart AND :dateEnd
  ) AS totalSales
  FROM walkstyle.products AS p
  GROUP BY p.product_id
  ORDER BY totalSales ${order}
  LIMIT 5;
`

  const rows: RowProducts[] = await sequelize.query(topSellingProductsQuery, {
    replacements: { dateStart, dateEnd },
    type: QueryTypes.SELECT
  })

  const mappedRows = rows.map(row => ({ ...row, totalSales: Number(row.totalSales) }))

  return mappedRows
}

interface RowCategories extends RowResponse {
  categoryId: string
}

export async function GetTopSellingCategories (
  { dateEnd = new Date(), dateStart = new Date() }: GetTopSellingParams = {}
) {
  const topSellingCategoriesQuery = `
  SELECT c.category_id as categoryId, c.name, IFNULL(SUM(totalSales.quantity), 0) as totalSales
  FROM categories AS c
  LEFT JOIN (
    SELECT pc.categoryId, SUM(sp.quantity) as quantity
    FROM product_category AS pc
    LEFT JOIN products AS p ON pc.productId = p.product_id
    LEFT JOIN sizes AS s ON s.productId = p.product_id
    LEFT JOIN sale_products AS sp ON s.size_id = sp.sizeId
    LEFT JOIN sales AS sa ON sp.saleId = sa.sale_id
    WHERE sa.createdAt BETWEEN :dateStart AND :dateEnd
    GROUP BY pc.categoryId
  ) as totalSales
  ON c.category_id = totalSales.categoryId
  GROUP BY c.category_id, c.name
  ORDER BY totalSales DESC;
`

  const rows: RowCategories[] = await sequelize.query(topSellingCategoriesQuery, {
    replacements: { dateStart, dateEnd },
    type: QueryTypes.SELECT
  })

  const mappedRows = rows.map(row => ({ ...row, totalSales: Number(row.totalSales) }))

  return mappedRows
}
