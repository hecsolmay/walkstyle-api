import { ROLE } from '@/constanst/enums'
import { GetById } from '@/service/user'
import { type RequestWithUser } from '@/types/queries'
import { ForbiddenError, NotFoundError, handleError } from '@/utils/errors'
import { type NextFunction, type Request, type Response } from 'express'

export async function existedUserValidator (req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.body.userId ?? ''

    const user = await GetById(userId)

    if (user === null) {
      throw new NotFoundError('User not found')
    }

    (req as RequestWithUser).user = user.toJSON()

    next()
  } catch (error) {
    return handleError(error, res)
  }
}

export async function adminRoleValidator (req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as RequestWithUser).user
    const role = user.role?.name ?? ''

    if (role !== ROLE.ADMIN) {
      throw new ForbiddenError('You are not allowed to be here')
    }

    next()
  } catch (error) {
    return handleError(error, res)
  }
}
