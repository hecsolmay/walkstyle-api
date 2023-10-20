import { type ROLE } from '@/constanst/enums'
import { type ProductDTO, type RegisterDTO } from '@/types/schemas'

export interface UserCreateDTO extends RegisterDTO {
  role?: ROLE
}

export interface ImageDTO {
  main: string
  thumbnail: string
  preview: string
}

export interface ProductImageDTO {
  productId: string
  imageId: string
}

export interface ProductCreateDTO extends Omit<ProductDTO, 'categories' | 'extraPrice' | 'stock' | 'size'> {}

export interface SizeCreateDTO {
  size: number
  extraPrice: number
  stock: number
  productId: string
}
