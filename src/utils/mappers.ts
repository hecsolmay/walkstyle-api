import { ROLE, STATUS } from '@/constanst/enums'
import { type ProductAttributes, type BrandAttributes, type CategoryAttributes, type ImageAttributes, type UserAttributes, type SizeAttributes, type SaleAttributes, type CategoryProductsAttributes } from '@/types/attributes'

export function mapImageAtributes (image?: ImageAttributes) {
  if (image === undefined) {
    return undefined
  }

  const { imageId, main, preview, thumbnail } = image

  return {
    imageId,
    main,
    preview,
    thumbnail
  }
}

export function getStatus (isDeleted: boolean): STATUS {
  return isDeleted ? STATUS.INACTIVE : STATUS.ACTIVE
}

export function mapUserAttributes (user: UserAttributes, timeStamps = false) {
  const { role, roleId, password, createdAt, updatedAt, deletedAt, ...rest } = user

  if (timeStamps) {
    const status = getStatus(Boolean(deletedAt))

    return {
      ...rest,
      status,
      role: role?.name ?? ROLE.USER,
      createdAt,
      updatedAt
    }
  }

  return {
    ...rest,
    role: role?.name
  }
}

export function mapCategoryAttributes (category: CategoryAttributes, timeStamps = false) {
  const { categoryId, name, banner, image, createdAt, deletedAt, updatedAt } = category

  const response = {
    categoryId,
    name,
    banner: mapImageAtributes(banner),
    image: mapImageAtributes(image)
  }

  if (timeStamps) {
    const status = getStatus(Boolean(deletedAt))

    return {
      ...response,
      status,
      createdAt,
      updatedAt
    }
  }

  return response
}

export function mapBrandsAttributes (brand: BrandAttributes, timeStamps = false) {
  const { brandId, name, banner, image, createdAt, deletedAt, updatedAt } = brand

  const response = {
    brandId,
    name,
    banner: mapImageAtributes(banner),
    image: mapImageAtributes(image)
  }

  if (timeStamps) {
    const status = getStatus(Boolean(deletedAt))

    return {
      ...response,
      status,
      createdAt,
      updatedAt
    }
  }

  return response
}

export function mapProductAttributes (product: ProductAttributes, timeStamps = false) {
  const { createdAt, sizes = [], categories = [], deletedAt, updatedAt, brandId, genderId, product_images: productImages, ...restOfProduct } = product

  const mappedCategories = categories.map(category => ({
    categoryId: category.categoryId,
    name: category.name
  }))

  const sortedSizes = [...sizes].sort((a, b) => a.size - b.size)
  const mappedSizes = sortedSizes.map(size => mapSizeAttributes(size))

  const images = productImages?.map(productImage => mapImageAtributes(productImage.image)) ?? []

  if (timeStamps) {
    const status = getStatus(Boolean(deletedAt))

    return {
      ...restOfProduct,
      sizes: mappedSizes,
      categories: mappedCategories,
      images,
      status,
      createdAt,
      updatedAt
    }
  }

  return {
    ...restOfProduct,
    sizes: mappedSizes,
    categories: mappedCategories,
    images
  }
}

export function mapSizeAttributes (size: SizeAttributes, timeStamps = false) {
  const { createdAt, deletedAt, updatedAt, ...restOfSize } = size

  if (timeStamps) {
    const status = getStatus(Boolean(deletedAt))

    return {
      ...restOfSize,
      status,
      createdAt,
      updatedAt
    }
  }

  return restOfSize
}

export function mapSaleProductAttributes (product: ProductAttributes, timeStamps = false) {
  const { createdAt, deletedAt, updatedAt, brandId, genderId, product_images: productImages, ...restOfProduct } = product

  const images = productImages?.map(productImage => mapImageAtributes(productImage.image)) ?? []

  if (timeStamps) {
    const status = getStatus(Boolean(deletedAt))

    return {
      ...restOfProduct,
      images,
      status,
      createdAt,
      updatedAt
    }
  }

  return {
    ...restOfProduct,
    images
  }
}

export function mapSaleAttributes (sale: SaleAttributes) {
  const { totalPaid, sizes = [], user, createdAt, updatedAt, saleId } = sale

  const mappedProducts = sizes.map(size => {
    const { sale_products: saleProduct, size: saleSize, product } = size

    let productResponse = {}

    if (product !== undefined) {
      productResponse = mapSaleProductAttributes(product)
    }

    return {
      saleProductId: saleProduct.saleProductId,
      originalPrice: saleProduct.originalPrice,
      extraPrice: saleProduct.extraPrice,
      quantity: saleProduct.quantity,
      total: saleProduct.total,
      size: saleSize,
      product: productResponse
    }
  })

  const response = {
    saleId,
    totalPaid,
    createdAt,
    updatedAt,
    user: {},
    products: mappedProducts
  }

  if (user !== undefined) {
    const { rememberToken, ...restOfUser } = mapUserAttributes(user)
    response.user = restOfUser
  }

  return response
}

export function mapCategoryProductAttributes (categoryProduct: CategoryProductsAttributes) {
  const { product } = categoryProduct

  if (product !== undefined) {
    return {
      product: mapProductAttributes(product)
    }
  }

  return categoryProduct
}
