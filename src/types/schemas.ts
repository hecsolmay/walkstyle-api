import { type loginDTO } from '@/schemas/auth'
import { type brandSchema } from '@/schemas/brand'
import { type categorySchema } from '@/schemas/category'
import { type imageArraySchema, type productSchema } from '@/schemas/product'
import { type sizeSchema } from '@/schemas/size'
import { type userDTO } from '@/schemas/user'
import { type z } from 'zod'

export type LoginDTO = z.infer<typeof loginDTO>
export type RegisterDTO = z.infer<typeof userDTO>
export type CategoryDTO = z.infer<typeof categorySchema>
export type BrandDTO = z.infer<typeof brandSchema>
export type ProductDTO = z.infer<typeof productSchema>
export type ImageArray = z.infer<typeof imageArraySchema>
export type SizeDTO = z.infer<typeof sizeSchema>
