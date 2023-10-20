import { getInfoPagination, validatePagination } from '@/schemas/pagination'
import { validateImageArray, validateProduct } from '@/schemas/product'
import { validateSearch } from '@/schemas/query'
import { saveImageProduct } from '@/service/image'
import { Create, DeleteById, GetAll, GetByid, RestoreById } from '@/service/products'
import { CreateSize } from '@/service/size'
import { ZodValidationError, handleError } from '@/utils/errors'
import { mapProductAttributes } from '@/utils/mappers'
import { type Request, type Response } from 'express'

export async function getProducts (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const query = validateSearch(req.query)

    const { count, products } = await GetAll({ ...pagination, ...query })

    const mappedProducts = products.map(product => mapProductAttributes(product.toJSON()))

    const info = getInfoPagination({ ...pagination, count })

    return res.status(200).json({ info, products: mappedProducts })
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

    return res.status(200).json({ product: mapProductAttributes(product.toJSON()) })
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

    const imagesResult = validateImageArray(req.body.images ?? [])

    if (!imagesResult.success) {
      return new ZodValidationError(imagesResult.error)
    }

    const { stock, size, extraPrice, categories, ...productDTO } = result.data
    const images = imagesResult.data

    const newProduct = await Create(productDTO)

    const promiseSaveImages = images.map(async images => await saveImageProduct({ imageId: images.imageId, productId: newProduct.productId ?? '' }))

    await Promise.all(promiseSaveImages)

    const newSize = { stock, size, extraPrice, productId: newProduct.productId ?? '' }

    const sizeCreated = await CreateSize(newSize)

    console.log({ product: newProduct.toJSON() })

    return res.status(201).json({ message: 'Product created', product: newProduct, images, size: sizeCreated, categories })
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
