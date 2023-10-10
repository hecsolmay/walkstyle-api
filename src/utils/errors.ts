import { type Response } from 'express'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
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

export function handleError (error: unknown, res: Response): Response<any, Record<string, any>> {
  console.error(error)

  // if (error instanceof ValidationRequestError) {
  //   return res.status(400).json({ message: 'Bad Request', error: error.message })
  // }

  if (error instanceof JsonWebTokenError) {
    return res.status(400).json({ message: 'Error in the JsonWebToken', error: error.message })
  }

  if (error instanceof ZodValidationError) {
    return res.status(400).json({ message: error.message, error: error.error })
  }

  if (error instanceof TokenExpiredError) {
    return res.status(403).json({ message: 'Token Expired Error', error: error.message })
  }

  if (error instanceof MulterValidationError) {
    return res.status(400).json({ message: 'Multer validation error', error: error.message })
  }

  if (error instanceof Error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message })
  }

  return res.status(500).json({ message: 'Internal Server Error' })
}
