import { z } from 'zod'

export const imageSchema = z.object({
  imageId: z.string().uuid(),
  main: z.string().url(),
  thumbnail: z.string().url(),
  preview: z.string().url()
})
