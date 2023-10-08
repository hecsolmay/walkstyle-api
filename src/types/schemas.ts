import { type loginDTO, type registerDTO } from '@/schemas/auth'
import { type categorySchema } from '@/schemas/category'
import { type z } from 'zod'

export type LoginDTO = z.infer<typeof loginDTO>
export type RegisterDTO = z.infer<typeof registerDTO>
export type CategoryDTO = z.infer<typeof categorySchema>
