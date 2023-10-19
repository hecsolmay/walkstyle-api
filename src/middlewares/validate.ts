import { validateProduct as validateProductSchema } from '@/schemas/product'
import { ZodValidationError, handleError } from '@/utils/errors'
import { type NextFunction, type Request, type Response } from 'express'

export function validateProduct (req: Request, res: Response, next: NextFunction) {
  try {
    const productStringized = req.body.product
    console.log(productStringized)
    const product = JSON.parse(productStringized ?? '{}')

    const result = validateProductSchema(product)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    next()
    // eslint-disable-next-line no-useless-return
    return
  } catch (error) {
    return handleError(error, res)
  }
}
