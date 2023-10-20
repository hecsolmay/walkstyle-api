import { GENDER, ROLE as RoleEnum } from '@/constanst/enums'
import Gender from '@/models/Gender'
import Role from '@/models/Role'

export async function createRoles () {
  const ROLES = Object.values(RoleEnum)

  try {
    const rolesInDb = await Role.findAll()

    if (rolesInDb.length === 0) {
      const bulkAsync = ROLES.map(async (role) => {
        await Role.create({ name: role })
      })
      await Promise.all(bulkAsync)
      console.log('Roles created')
      return
    }

    const rolesName = rolesInDb.map(role => role.name)

    const rolesNotInDb = ROLES.filter(role => !rolesName.includes(role))

    if (rolesNotInDb.length > 0) {
      const bulkAsync = rolesNotInDb.map(async (role) => {
        await Role.create({ name: role })
      })
      await Promise.all(bulkAsync)
      console.log('New Roles created')
      return
    }

    console.log('Roles already created')
  } catch (error) {
    console.error({ message: 'Ocurrio algo al crear los roles', error })
  }
}

export async function createGenders () {
  const Genders = Object.values(GENDER)

  try {
    const gendersInDb = await Gender.findAll()
    if (gendersInDb.length === 0) {
      const bulkAsync = Genders.map(async (gender) => {
        await Gender.create({ name: gender })
      })
      await Promise.all(bulkAsync)
      console.log('Genders created')
      return
    }

    const gendersName = gendersInDb.map(gender => gender.name)

    const gendersNotInDb = Genders.filter(gender => !gendersName.includes(gender))

    if (gendersNotInDb.length > 0) {
      const bulkAsync = gendersNotInDb.map(async (gender) => {
        await Gender.create({ name: gender })
      })
      await Promise.all(bulkAsync)
      console.log('New Genders created')
      return
    }

    console.log('Genders already created')
  } catch (error) {
    console.error({ message: 'Ocurrio algo al crear los generos', error })
  }
}
