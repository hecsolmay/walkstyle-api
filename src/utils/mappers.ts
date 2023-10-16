import { ROLE, STATUS } from '@/constanst/enums'
import { type BrandAttributes, type CategoryAttributes, type ImageAttributes, type UserAttributes } from '@/types/attributes'

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
