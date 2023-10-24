import { DEFAULT_PAGINATION_WITH_SEARCH } from '@/constanst'
import Brand from '@/models/Brand'
import Category from '@/models/Category'
import Gender from '@/models/Gender'
import Image from '@/models/Image'
import Product from '@/models/Product'
import ProductImage from '@/models/Product-Image'
import Size from '@/models/Size'
import { type ProductCreateDTO } from '@/types/createDto'
import { type QueryWithDeleted } from '@/types/queries'
import { UnexpectedError } from '@/utils/errors'
import { Op } from 'sequelize'

const excludeTimeStamps = ['createdAt', 'updatedAt', 'deletedAt']

export async function GetAll ({
  limit = 10,
  offset = 0,
  q = '',
  getDeleted
}: QueryWithDeleted = DEFAULT_PAGINATION_WITH_SEARCH) {
  const deleted = Boolean(getDeleted)

  const products = await Product.findAll({
    offset,
    limit,
    include: [
      { model: Gender, attributes: { exclude: excludeTimeStamps } },
      { model: Brand, attributes: { exclude: excludeTimeStamps } },
      { model: Size, attributes: { exclude: [...excludeTimeStamps, 'productId'] } },
      {
        model: ProductImage,
        attributes: { exclude: excludeTimeStamps },
        include: [{ model: Image, attributes: { exclude: excludeTimeStamps } }]
      },
      { model: Category, attributes: { exclude: [...excludeTimeStamps] } }
    ],
    where: {
      name: {
        [Op.like]: `%${q}%`
      }
    },
    paranoid: !deleted
  })

  const count = await Product.count({
    paranoid: !deleted
  })

  return { products, count }
}

export async function GetByid (productId?: string) {
  const product = await Product.findByPk(productId, {
    include: [
      { model: Gender, attributes: { exclude: excludeTimeStamps } },
      { model: Brand, attributes: { exclude: excludeTimeStamps } },
      { model: Size, attributes: { exclude: [...excludeTimeStamps, 'productId'] } },
      {
        model: ProductImage,
        attributes: { exclude: excludeTimeStamps },
        include: [{ model: Image, attributes: { exclude: excludeTimeStamps } }]
      },
      { model: Category, attributes: { exclude: [...excludeTimeStamps] } }
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

export async function Create (newProduct: ProductCreateDTO) {
  const { gender, ...restOfProduct } = newProduct

  const genderFound = await Gender.findOne({
    where: {
      name: gender
    }
  })

  if (genderFound === null) {
    throw new UnexpectedError('Gender not found')
  }

  const genderId = genderFound.genderId ?? ''

  const product = await Product.create({ ...restOfProduct, genderId })
  await product.save()
  return product
}

interface UpdateProduct {
  productId?: string
  newProduct: Partial<ProductCreateDTO>
}

export async function UpdateById ({ newProduct, productId }: UpdateProduct) {
  const { gender, ...rest } = newProduct

  if (gender === undefined) {
    const [updatedCount] = await Product.update(rest, {
      where: {
        productId
      }
    })

    return updatedCount
  }

  const genderFound = await Gender.findOne({
    where: {
      name: gender
    }
  })

  if (genderFound === null) {
    throw new UnexpectedError('Gender not found')
  }

  const genderId = genderFound.genderId ?? ''

  const [updatedCount] = await Product.update({ ...rest, genderId }, {
    where: {
      productId
    }
  })

  return updatedCount
}
