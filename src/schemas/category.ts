import { z } from 'zod'
import { imageSchema } from './image'

export const categorySchema = z.object({
  name: z.string(),
  image: imageSchema,
  banner: imageSchema
})

export function validateCategory (input: any) {
  return categorySchema.safeParse(input)
}

export function partialCategory (input: any) {
  return categorySchema.partial().safeParse(input)
}
