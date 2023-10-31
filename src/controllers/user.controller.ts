import { partialImage } from '@/schemas/image'
import { getInfoPagination, validatePagination } from '@/schemas/pagination'
import { validateSearch } from '@/schemas/query'
import { validateRole } from '@/schemas/role'
import { partialUser, validateChangePassword } from '@/schemas/user'
import { DeleteById, GetAll, GetById, GetOne, RestoreById, UpdateById } from '@/service/user'
import { NotFoundError, ZodValidationError, handleError } from '@/utils/errors'
import { mapUserAttributes } from '@/utils/mappers'
import { type Request, type Response } from 'express'

export async function getUsers (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const query = validateSearch(req.query)

    const { users, count } = await GetAll({ ...pagination, ...query })

    const mappedUser = users.map((user) => mapUserAttributes(user.toJSON()))

    const info = getInfoPagination({ ...pagination, count })

    return res.status(200).json({ info, users: mappedUser })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function getusersDeleted (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const query = validateSearch(req.query)

    const { users, count } = await GetAll({ ...pagination, ...query, getDeleted: true })
    const mappedUser = users.map((users) => mapUserAttributes(users.toJSON(), true))

    const info = getInfoPagination({ ...pagination, count })

    return res.status(200).json({ info, users: mappedUser })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function getUserById (req: Request, res: Response) {
  try {
    const user = await GetById(req.params.userId)

    if (user === null) {
      return res.status(404).json({ message: 'User not found' })
    }

    const mappedUser = mapUserAttributes(user.toJSON())

    return res.status(200).json({ user: mappedUser })
  } catch (error) {
    return handleError(error, res)
  }
}
export async function updateUserById (req: Request, res: Response) {
  try {
    const result = partialUser(req.body)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }
    const newUser = result.data

    const existedUser = await GetOne({
      email: newUser.email ?? ''
    })

    if (existedUser !== null && existedUser.userId !== req.params.sizeId) {
      return res.status(409).json({ message: 'User already exists' })
    }

    const { userId } = req.params
    const updatedCount = await UpdateById({ userId, newUser })

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

export async function deleteUser (req: Request, res: Response) {
  try {
    const deletedCount = await DeleteById(req.params.userId)

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

export async function restoreUser (req: Request, res: Response) {
  try {
    const userRestore = await RestoreById(req.params.userId)

    if (userRestore === null) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.json({ message: 'User restored', user: mapUserAttributes(userRestore.toJSON()) })
  } catch (error) {
    return handleError(error, res)
  }
}
export async function changeRole (req: Request, res: Response) {
  try {
    const result = validateRole(req.body.role)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }
    const userData = result.data

    const { userId } = req.params
    const updatedCount = await UpdateById({ userId, newUser: { role: userData } })

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

export async function restorePassword (req: Request, res: Response) {
  try {
    const result = validateChangePassword(req.body)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    const { oldPassword, newPassword } = result.data

    const user = await GetById(req.params.userId)

    if (user === null) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await user.validPassword(oldPassword)

    if (!isMatch) {
      return res.status(400).json({ message: 'Password incorrect' })
    }

    await user.update({ password: newPassword })

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

export async function changeProfile (req: Request, res: Response) {
  try {
    const result = partialImage(req.body.image)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    const image = result.data

    const userId = req.params.userId ?? ''
    const newProfileImage = image?.main === undefined ? null : image.main

    const updatedCount = await UpdateById({ userId, newUser: { profileUrl: newProfileImage } })

    if (updatedCount === 0) {
      throw new NotFoundError('User not found')
    }

    return res.json({ profileUrl: newProfileImage })
  } catch (error) {
    return handleError(error, res)
  }
}
