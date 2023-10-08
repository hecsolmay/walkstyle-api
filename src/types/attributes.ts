import { type GENDER, type ROLE } from '@/constanst/enums'

export interface TimeStamps {
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
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

export interface ProductAttributes {
  productId?: string
  name: string
  description: string
  price: number
  genderId: string
  brandId: string
}

export interface BrandAttributes {
  brandId?: string
  name: string
  imageId: string
  bannerId: string
}

export interface SizeAttributes {
  sizeId?: string
  extra: number
  size: number
  stock: number
  productId: string
}

export interface CategoryAttributes {
  categoryId?: string
  name: string
  imageId: string
  bannerId: string
}

export interface RoleAttributes {
  roleId?: string
  name: ROLE
}

export interface GenderAttributes {
  genderId?: string
  name: GENDER
}

export interface CategoryProductsAttributes {
  categoryId: string
  productId: string
}

export interface ProductImageAttributes {
  productImageId?: string
  productId: string
  imageId: string
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
  extra?: number
  quantity: number
  total: number
}

export interface ImageAttributes {
  imageId?: string
  main: string
  preview: string
  thumbnail: string
}
