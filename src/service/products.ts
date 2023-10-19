import { DEFAULT_PAGINATION_WITH_SEARCH } from '@/constanst'
import Brand from '@/models/Brand'
import Gender from '@/models/Gender'
import Product from '@/models/Product'
import Size from '@/models/Size'
import { type QueryWithDeleted } from '@/types/queries'
import { Op } from 'sequelize'

export async function GetAll ({
  limit = 10,
  offset = 0,
  q = '',
  getDeleted
}: QueryWithDeleted = DEFAULT_PAGINATION_WITH_SEARCH) {
  const deleted = Boolean(getDeleted)

  const { count, rows: products } = await Product.findAndCountAll({
    offset,
    limit,
    include: [
      { model: Gender },
      { model: Brand },
      { model: Size }
    ],
    where: {
      name: {
        [Op.like]: `%${q}%`
      }
    },
    paranoid: !deleted
  })

  return { products, count }
}

export async function GetByid (productId?: string) {
  const product = await Product.findByPk(productId, {
    include: [
      { model: Gender },
      { model: Brand },
      { model: Size }
    ]
  })

  return product
}

export async function DeleteById (productId?: string) {
  const deletedCount = await Product.destroy({
    where: {
      productId
    }
  })

  return deletedCount
}

export async function RestoreById (productId?: string) {
  const product = await Product.findByPk(productId, {
    include: [
      { model: Gender },
      { model: Brand },
      { model: Size }
    ],
    paranoid: false
  })

  if (product === null) {
    return null
  }

  await product.restore()

  return product
}
