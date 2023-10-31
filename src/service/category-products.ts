import Brand from '@/models/Brand'
import Category from '@/models/Category'
import Gender from '@/models/Gender'
import Image from '@/models/Image'
import Product from '@/models/Product'
import ProductImage from '@/models/Product-Image'
import ProductCategory from '@/models/Products-Category'
import Size from '@/models/Size'
import { getOrderProducts } from '@/utils/sort-query'

const excludeTimeStamps = ['createdAt', 'updatedAt', 'deletedAt']

interface CategoryProduct {
  categoryId?: string
  productId?: string
}

export async function GetAllProductCategories ({ productId = '' }) {
  const productCategories = await ProductCategory.findAll({
    where: {
      productId
    }
  })

  return productCategories
}

export async function CreateProductCategory ({ categoryId = '', productId = '' }: CategoryProduct) {
  const categoryProduct = await ProductCategory.create({ categoryId, productId })
  await categoryProduct.save()

  return categoryProduct
}

export async function DeleteProductCategory ({ categoryId, productId = '' }: CategoryProduct) {
  const deletedCount = await ProductCategory.destroy({
    where: {
      categoryId,
      productId
    }
  })

  return deletedCount
}

export async function getAllProductsByCategory ({ categoryId = '', limit = 10, offset = 0, order = 'recents' }) {
  const orderInput = order as any
  const orderSorted = getOrderProducts({ order: orderInput })

  const products = await ProductCategory.findAll({
    limit,
    offset,
    include: [
      {
        model: Product,
        order: [orderSorted],
        include: [
          { model: Gender, attributes: { exclude: excludeTimeStamps }, paranoid: false },
          { model: Brand, attributes: { exclude: excludeTimeStamps }, paranoid: false },
          { model: Size, attributes: { exclude: [...excludeTimeStamps, 'productId'] }, paranoid: false },
          {
            model: ProductImage,
            attributes: { exclude: excludeTimeStamps },
            include: [{ model: Image, attributes: { exclude: excludeTimeStamps } }],
            paranoid: false
          },
          { model: Category, attributes: { exclude: [...excludeTimeStamps] } }
        ]
      }
    ],
    where: {
      categoryId
    }
  })

  const count = await ProductCategory.count({
    where: {
      categoryId
    }
  })

  return { count, products }
}
