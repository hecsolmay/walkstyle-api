import { z } from 'zod'
import { imageSchema } from './image'

export const brandSchema = z.object({
  name: z.string(),
  image: imageSchema,
  banner: imageSchema
})

export function validateBrand (input: any) {
  return brandSchema.safeParse(input)
}

export function partialBrand (input: any) {
  return brandSchema.partial().safeParse(input)
}
