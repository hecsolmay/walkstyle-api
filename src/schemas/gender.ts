import { GENDER } from '@/constanst/enums'
import { z } from 'zod'

export const genderSchema = z.nativeEnum(GENDER)

export function validateGender (gender: any) {
  const result = genderSchema.safeParse(gender)

  if (!result.success) {
    return genderSchema.parse(GENDER.MALE)
  }

  return result.data
}
