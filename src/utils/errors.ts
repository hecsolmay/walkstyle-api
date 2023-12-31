import { DEFAULT_FORBIDDEN_ERROR, DEFAULT_NOTFOUND_ERROR, DEFAULT_UNAUTHORIZED_ERROR } from '@/constanst'
import { type Response } from 'express'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { ForeignKeyConstraintError, ValidationError } from 'sequelize'
import { type ZodError } from 'zod'

export class MulterValidationError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'MulterValidationError'
  }
}

export class ZodValidationError extends Error {
  public error: any

  constructor (error: ZodError) {
    super('Ocurrió un error al procesar tu solicitud')
    this.name = 'ZodValidationError'
    this.error = JSON.parse(error.message)
  }
}

export class UnexpectedError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'UnexpectedError'
  }
}

export class UnauthorizedError extends Error {
  constructor (message?: string) {
    const messageError = message ?? DEFAULT_UNAUTHORIZED_ERROR
    super(messageError)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor (message?: string) {
    const messageError = message ?? DEFAULT_FORBIDDEN_ERROR
    super(messageError)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends Error {
  constructor (message?: string) {
    const messageError = message ?? DEFAULT_NOTFOUND_ERROR
    super(messageError)
    this.name = 'NotFoundError'
  }
}

export function handleError (error: unknown, res: Response): Response<any, Record<string, any>> {
  console.error(error)

  // if (error instanceof ValidationRequestError) {
  //   return res.status(400).json({ message: 'Bad Request', error: error.message })
  // }

  if (error instanceof JsonWebTokenError) {
    return res.status(401).json({ message: 'Error in the JsonWebToken', error: error.message })
  }

  if (error instanceof UnexpectedError) {
    return res.status(400).json({ message: 'Unexpected Error', error: error.message })
  }

  if (error instanceof ValidationError || error instanceof ForeignKeyConstraintError) {
    return res.status(400).json({ message: 'Error in the validation', error: error.message })
  }

  if (error instanceof ZodValidationError) {
    return res.status(400).json({ message: error.message, error: error.error })
  }

  if (error instanceof UnauthorizedError) {
    return res.status(401).json({ message: error.message })
  }

  if (error instanceof ForbiddenError) {
    return res.status(403).json({ message: error.message })
  }

  if (error instanceof TokenExpiredError) {
    return res.status(403).json({ message: 'Token Expired Error', error: error.message })
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({ message: error.message })
  }

  if (error instanceof MulterValidationError) {
    return res.status(400).json({ message: 'Multer validation error', error: error.message })
  }

  if (error instanceof Error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message })
  }

  return res.status(500).json({ message: 'Internal Server Error' })
}
