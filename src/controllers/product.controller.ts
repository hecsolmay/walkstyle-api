import { getInfoPagination, validatePagination } from '@/schemas/pagination'
import { partialProduct, validateImageArray, validateProduct } from '@/schemas/product'
import { validateSearch } from '@/schemas/query'
import { GetAllIn } from '@/service/category'
import { CreateProductCategory, GetAllProductCategories } from '@/service/category-products'
import { deletedImagesProduct, saveImageProduct } from '@/service/image'
import { Create, DeleteById, GetAll, GetByid, RestoreById, UpdateById } from '@/service/products'
import { CreateSize, GetProductSizes } from '@/service/size'
import { ZodValidationError, handleError } from '@/utils/errors'
import { mapProductAttributes, mapSizeAttributes } from '@/utils/mappers'
import { type Request, type Response } from 'express'

export async function getProducts (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const order = req.query.order ?? '' as any
    const query = validateSearch(req.query)

    const { count, products } = await GetAll({ ...pagination, ...query, order })

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
    const order = req.query.order ?? '' as any
    const query = validateSearch(req.query)

    const { count, products } = await GetAll({ ...pagination, ...query, order, getDeleted: true })

    const info = getInfoPagination({ ...pagination, count })

    const mappedProducts = products.map(product => mapProductAttributes(product.toJSON(), true))

    return res.status(200).json({ info, products: mappedProducts })
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

export async function getProductSize (req: Request, res: Response) {
  try {
    const product = await GetByid(req.params.productId)

    if (product === null) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const sizes = await GetProductSizes(req.params.productId, true)

    const mappedSizes = sizes.map(size => mapSizeAttributes(size.toJSON(), true))

    return res.status(200).json({ sizes: mappedSizes })
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

    const notRepeatCategories = new Set(categories)
    const categoriesArray = Array.from(notRepeatCategories)

    const categoriesModels = await GetAllIn(categoriesArray)

    if (categoriesModels.length !== categoriesArray.length) {
      return res.status(404).json({ message: 'Category not found' })
    }

    const newProduct = await Create(productDTO)

    const promiseSaveImages = images.map(async images => await saveImageProduct({ imageId: images.imageId, productId: newProduct.productId ?? '' }))

    const promiseCategories = categoriesModels.map(async category => await CreateProductCategory({ categoryId: category.categoryId, productId: newProduct.productId }))

    await Promise.all([promiseSaveImages, promiseCategories])

    const newSize = { stock, size, extraPrice, productId: newProduct.productId ?? '' }

    const sizeCreated = await CreateSize(newSize)

    console.log({ product: newProduct.toJSON() })

    return res.status(201).json({ message: 'Product created', product: newProduct, images, size: sizeCreated })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function updateProduct (req: Request, res: Response) {
  try {
    const productStringized = req.body.product
    const productParse = JSON.parse(productStringized ?? null)

    const result = partialProduct(productParse)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    const resultImage = validateImageArray(req.body.images ?? [])

    if (!resultImage.success) {
      throw new ZodValidationError(resultImage.error)
    }

    const { stock, size, extraPrice, categories, ...productDTO } = result.data

    const updatedCount = await UpdateById({ productId: req.params.productId, newProduct: productDTO })

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const notRepeatCategories = new Set(categories ?? [])
    const categoriesArray = Array.from(notRepeatCategories)

    const categoriesModels = await GetAllIn(categoriesArray)

    if (categoriesModels.length !== categoriesArray.length) {
      return res.status(404).json({ message: 'Category not found' })
    }

    const categoriesFound = await GetAllProductCategories({ productId: req.params.productId })

    const categoriesToDelete = categoriesFound.filter(category => !categoriesArray.includes(category.categoryId))

    const newCategories = categoriesArray.filter(category => !categoriesFound.map(category => category.categoryId).includes(category))

    if (newCategories.length > 0) {
      const promiseCategories = newCategories.map(async categoryId => await CreateProductCategory({ categoryId, productId: req.params.productId }))
      await Promise.all(promiseCategories)
    }

    if (categoriesToDelete.length > 0) {
      const promiseDeletedCategories = categoriesToDelete.map(async category => {
        await category.destroy()
      })

      await Promise.all(promiseDeletedCategories)
    }

    const images = resultImage.data

    if (images.length > 0) {
      await deletedImagesProduct(req.params.productId)
      const promiseSaveImages = images.map(async image => await saveImageProduct({ imageId: image.imageId, productId: req.params.productId }))
      await Promise.all(promiseSaveImages)
    }

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

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
