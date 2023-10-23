import { type GENDER, type ROLE } from '@/constanst/enums'

export interface TimeStamps {
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export interface BannerAndImage {
  bannerId: string
  banner?: ImageAttributes
  imageId: string
  image?: ImageAttributes
}

export interface UserAttributes extends TimeStamps {
  userId?: string
  name: string
  lastname?: string
  fullname?: string
  email: string
  password?: string
  profileUrl?: string
  rememberToken?: string
  roleId: string
  role?: RoleAttributes
}

export interface ProductAttributes extends TimeStamps {
  productId?: string
  name: string
  details: string
  price: number
  genderId: string
  brandId: string
  brand?: BrandAttributes
  gender?: GenderAttributes
  product_images?: ProductImageAttributes[]
  categories?: CategoryAttributes[]
}

export interface BrandAttributes extends BannerAndImage, TimeStamps {
  brandId?: string
  name: string
}

export interface SizeAttributes {
  sizeId?: string
  extraPrice: number
  size: number
  stock: number
  productId: string
}

export interface CategoryAttributes extends BannerAndImage, TimeStamps {
  categoryId?: string
  name: string
}

export interface RoleAttributes extends TimeStamps {
  roleId?: string
  name: ROLE
}

export interface GenderAttributes extends TimeStamps {
  genderId?: string
  name: GENDER
}

export interface CategoryProductsAttributes extends TimeStamps {
  categoryId: string
  productId: string
}

export interface ProductImageAttributes extends TimeStamps {
  productImageId?: string
  productId: string
  imageId: string
  image?: ImageAttributes
}

export interface SaleAttributes {
  saleId?: string
  userId: string
  totalPaid: number
}

export interface SaleProductAttributes extends TimeStamps {
  saleProductId?: string
  saleId: string
  sizeId: string
  originalPrice: number
  extraPrice?: number
  quantity: number
  total: number
}

export interface ImageAttributes extends TimeStamps {
  imageId?: string
  main: string
  preview: string
  thumbnail: string
}
