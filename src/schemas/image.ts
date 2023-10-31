import { z } from 'zod'

export const imageSchema = z.object({
  imageId: z.string().uuid(),
  main: z.string().url(),
  thumbnail: z.string().url(),
  preview: z.string().url()
})

export function validateImage (input: any) {
  return imageSchema.safeParse(input)
}

export function partialImage (input: any) {
  return imageSchema.partial().safeParse(input)
}
