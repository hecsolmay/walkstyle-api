import ProductCategory from '@/models/Products-Category'

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
