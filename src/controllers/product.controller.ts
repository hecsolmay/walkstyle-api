import { getInfoPagination, validatePagination } from '@/schemas/pagination'
import { validateProduct } from '@/schemas/product'
import { validateSearch } from '@/schemas/query'
import { DeleteById, GetAll, GetByid, RestoreById } from '@/service/products'
import { ZodValidationError, handleError } from '@/utils/errors'
import { type Request, type Response } from 'express'

export async function getProducts (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const query = validateSearch(req.query)

    const { count, products } = await GetAll({ ...pagination, ...query })

    const info = getInfoPagination({ ...pagination, count })

    return res.status(200).json({ info, products })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function getProductsDeleted (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const query = validateSearch(req.query)

    const { count, products } = await GetAll({ ...pagination, ...query, getDeleted: true })

    const info = getInfoPagination({ ...pagination, count })

    return res.status(200).json({ info, products })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function getProductById (req: Request, res: Response) {
  try {
    const product = await GetByid(req.params.productId)

    if (product === null) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.status(200).json({ product })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function createProduct (req: Request, res: Response) {
  try {
    const productStringized = req.body.product
    const productParse = JSON.parse(productStringized ?? null)

    const result = validateProduct(productParse)

    if (!result.success) {
      return new ZodValidationError(result.error)
    }

    const productDTO = result.data

    console.log({ productDTO })

    return res.status(201).json({ message: 'Product created', product: productDTO })
  } catch (error) {
    return handleError(error, res)
  }
}
// export async function updateProduct (req: Request, res: Response) {}
export async function deleteProduct (req: Request, res: Response) {
  try {
    const deletedCount = await DeleteById(req.params.productId)

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

export async function restoreProduct (req: Request, res: Response) {
  try {
    const restoreProduct = await RestoreById(req.params.productId)

    if (restoreProduct === null) {
      return res.status(404).json({ message: 'Product not found' })
    }

    return res.status(200).json({ message: 'Product Restore', product: restoreProduct })
  } catch (error) {
    return handleError(error, res)
  }
}
