import { ROLE as RoleEnum } from '@/constanst/enums'
import Role from '@/models/Role'
import User from '@/models/User'
import { type UserCreateDTO } from '@/types/createDto'

export async function getAll () {
  const users = await User.findAll()
  return users
}

export async function getById (id: string) {
  const user = await User.findOne({
    include: {
      model: Role,
      attributes: ['name']
    },
    where: {
      userId: id
    }
  })
  return user
}

export async function create (user: UserCreateDTO) {
  const { role = RoleEnum.USER, ...rest } = user
  const foundRole = await Role.findOne({
    where: {
      name: role
    }
  })
  const newUser = await User.create({ ...rest, roleId: foundRole?.roleId ?? '' })
  const savedUser = await newUser.save()
  return savedUser
}
interface Params {
  email: string // Declarar una propiedad 'email' en el objeto Params
}

export async function getOne (params: Params) {
  const { email } = params
  // Ahora puedes acceder a 'email' dentro del objeto 'params'
  const user = await User.findOne({
    include: {
      model: Role,
      attributes: ['name']
    },
    where: {
      email
    }
  })
  return user
}
