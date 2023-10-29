import { UnauthorizedError, handleError } from '@/utils/errors'
import { tokenVerify } from '@/utils/jwtoken'
import { type NextFunction, type Request, type Response } from 'express'

export function verifyAccessToken (req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization

    if (authHeader === undefined) {
      throw new UnauthorizedError()
    }

    const headerToken = authHeader.split('Bearer ')[1]
    const token = headerToken ?? ''

    const verifyData = tokenVerify(token)

    req.body.userId = verifyData.userId

    next()
  } catch (error) {
    return handleError(error, res)
  }
}
