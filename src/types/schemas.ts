import { type loginDTO, type registerDTO } from '@/schemas/auth'
import { type brandSchema } from '@/schemas/brand'
import { type categorySchema } from '@/schemas/category'
import { type z } from 'zod'

export type LoginDTO = z.infer<typeof loginDTO>
export type RegisterDTO = z.infer<typeof registerDTO>
export type CategoryDTO = z.infer<typeof categorySchema>
export type BrandDTO = z.infer<typeof brandSchema>
