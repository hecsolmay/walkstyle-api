import { partialSize, validateSize } from '@/schemas/size'
import { GetByid as GetProductByid } from '@/service/products'
import { CreateSize, DeleteById, GetOneSize, RestoreById, UpdateById } from '@/service/size'
import { ZodValidationError, handleError } from '@/utils/errors'
import { type Request, type Response } from 'express'

export async function createSize (req: Request, res: Response) {
  try {
    const result = validateSize(req.body)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    const newSize = result.data

    const existedSize = await GetOneSize({
      productId: newSize.productId,
      size: newSize.size,
      getDeleted: true
    })

    if (existedSize !== null) {
      return res.status(409).json({ message: 'Size already exists' })
    }

    const existedProduct = await GetProductByid(newSize.productId)

    if (existedProduct === null) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const size = await CreateSize(newSize)

    return res.status(201).json({ message: 'Size Created', size })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function updateSizeById (req: Request, res: Response) {
  try {
    const result = partialSize(req.body)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    const newSize = result.data

    const existedSize = await GetOneSize({
      productId: newSize.productId ?? '',
      size: newSize.size ?? 0
    })

    if (existedSize !== null && existedSize.sizeId !== req.params.sizeId) {
      return res.status(409).json({ message: 'Size already exists' })
    }

    const existedProduct = await GetProductByid(newSize.productId)

    if (existedProduct === null) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const updatedCount = await UpdateById({ sizeId: req.params.sizeId, updateSize: newSize })

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Size not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

export async function deleteSizeById (req: Request, res: Response) {
  try {
    // const size = GetById(req.params.sizeId)
    const deletedCount = await DeleteById(req.params.sizeId)

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Size Not Found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

export async function restoreSizeById (req: Request, res: Response) {
  try {
    // const size = GetById(req.params.sizeId)
    const restoredSize = await RestoreById(req.params.sizeId)

    if (restoredSize === null) {
      return res.status(404).json({ message: 'Size Not Found' })
    }

    return res.json({ message: 'Size Restored', size: restoredSize })
  } catch (error) {
    return handleError(error, res)
  }
}
