import { type GENDER } from '@/constanst/enums'
import Gender from '@/models/Gender'

export async function GetOneGender (genderInput: GENDER) {
  const gender = await Gender.findOne({
    where: {
      name: genderInput
    }
  })

  return gender
}
