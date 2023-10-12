import { z } from 'zod'

const DEFAULT_SEARCH = { q: '' }

export const searchSchema = z.object({
  q: z.string().optional().default('')
})

export function validateSearch (search: any) {
  const result = searchSchema.safeParse(search)

  if (!result.success) {
    return searchSchema.parse(DEFAULT_SEARCH)
  }

  return result.data
}
