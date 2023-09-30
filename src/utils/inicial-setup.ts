import { Role as RoleEnum } from '@/constanst/enums'
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
