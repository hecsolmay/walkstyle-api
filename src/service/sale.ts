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
