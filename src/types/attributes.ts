import { type Role, type Gender } from '@/constanst/enums'

export interface TimeStamps {
  createdAt?: Date
  updatedAt?: Date
}

export interface UserAttributes extends TimeStamps {
  userId?: string
  name: string
  lastname: string
  fullname: string | null
  email: string
  password?: string
  profileUrl: string
  rememberToken: string | null
  roleId: string
}

export interface ProductAttributes {
  productId?: string
  name: string
  description: string
  price: number
  genderId: string
  branchId: string
}

export interface BranchAttributes {
  branchId?: string
  name: string
  imageUrl: string | null
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
  imageUrl: string
}

export interface RoleAttributes {
  roleId?: string
  name: Role
}

export interface GenderAttributes {
  genderId?: string
  name: Gender
}

export interface CategoryProductsAttributes {
  categoryId: string
  productId: string
}

export interface ProductImageAttributes {
  productImageId?: string
  productId: string
  main: string
  thumbnail: string
  preview: string
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
