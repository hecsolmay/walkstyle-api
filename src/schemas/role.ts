import { ROLE } from '@/constanst/enums'
import { z } from 'zod'

export const roleSchema = z.nativeEnum(ROLE)

export function validateRole (input: any) {
  return roleSchema.safeParse(input)
}
