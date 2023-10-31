import { DEFAULT_PAGINATION_WITH_SEARCH } from '@/constanst'
import { ROLE as RoleEnum } from '@/constanst/enums'
import Role from '@/models/Role'
import User from '@/models/User'
import { type UserCreateDTO } from '@/types/createDto'
import { type QueryWithDeleted } from '@/types/queries'
import { UnexpectedError } from '@/utils/errors'
import { Op } from 'sequelize'

export async function GetAll ({
  limit = 10,
  offset = 0,
  q = '',
  getDeleted
}: QueryWithDeleted = DEFAULT_PAGINATION_WITH_SEARCH) {
  const deleted = Boolean(getDeleted)

  const { count, rows: users } = await User.findAndCountAll({
    include: {
      model: Role,
      attributes: ['name']
    },
    limit,
    offset,
    where: {
      [Op.or]: [
        { fullname: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } }
      ]
    },
    paranoid: !deleted
  })

  return { count, users }
}

export async function GetById (userId?: string) {
  const user = await User.findByPk(userId, {
    include: {
      model: Role,
      attributes: ['name']
    }
  })
  return user
}

export async function Create (user: UserCreateDTO) {
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
  email: string
}

export async function GetOne (params: Params) {
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

interface newUserUpdate extends UserCreateDTO {
  profileUrl: string | null
}

interface UpdateParams {
  userId?: string
  newUser: Partial<newUserUpdate>
}

export async function UpdateById ({ userId, newUser }: UpdateParams) {
  const { role, ...rest } = newUser

  const updateUser = { ...rest }

  if (role === undefined) {
    const [updatedCount] = await User.update(updateUser, {
      where: {
        userId
      }
    })

    return updatedCount
  }

  const foundRole = await Role.findOne({
    where: {
      name: role
    }
  })

  if (foundRole === null) {
    throw new UnexpectedError('Role not found')
  }

  const [updatedCount] = await User.update({ ...updateUser, roleId: foundRole?.roleId ?? '' }, {
    where: {
      userId
    }
  })

  return updatedCount
}

export async function DeleteById (userId?: string) {
  const deletedCount = await User.destroy({
    where: {
      userId
    }
  })

  return deletedCount
}

export async function RestoreById (userId?: string) {
  const user = await User.findByPk(userId, {
    paranoid: false
  })

  if (user === null) {
    return null
  }

  await user.restore()

  return user
}
