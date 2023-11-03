import { partialCategory, validateCategory } from '@/schemas/category'
import { getInfoPagination, validatePagination } from '@/schemas/pagination'
import { validateSearch } from '@/schemas/query'
import { Create, DeleteById, GetAll, GetById, RestoreById, UpdateById } from '@/service/category'
import { getAllProductsByCategory } from '@/service/category-products'
import { ZodValidationError, handleError } from '@/utils/errors'
import { mapCategoryAttributes, mapCategoryProductAttributes } from '@/utils/mappers'
import { type Request, type Response } from 'express'

export async function getCategories (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const query = validateSearch(req.query)
    const order = req.query.order as any

    const { categories, count } = await GetAll({ ...pagination, ...query, order })

    const mappedCategories = categories.map(category => mapCategoryAttributes(category.toJSON()))

    const info = getInfoPagination({ ...pagination, count })

    return res.status(200).json({ info, categories: mappedCategories })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function getCategoriesDeleted (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const query = validateSearch(req.query)

    const { categories, count } = await GetAll({ ...pagination, ...query, getDeleted: true })

    const mappedCategories = categories.map(category => mapCategoryAttributes(category.toJSON(), true))

    const info = getInfoPagination({ ...pagination, count })

    return res.status(200).json({ info, categories: mappedCategories })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function getCategoryById (req: Request, res: Response) {
  try {
    const category = await GetById(req.params.categoryId)

    if (category === null) {
      return res.status(404).json({ message: 'Category not found' })
    }

    const mappedCategory = mapCategoryAttributes(category.toJSON())

    return res.status(200).json({ category: mappedCategory })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function getProductsByCategory (req: Request, res: Response) {
  try {
    const category = await GetById(req.params.categoryId)
    const pagination = validatePagination(req.query)
    const order = req.query.order ?? '' as any

    if (category === null) {
      return res.status(404).json({ message: 'Category not found' })
    }

    const { limit, offset } = pagination
    const { products, count } = await getAllProductsByCategory({ order, limit, offset, categoryId: category.categoryId })

    // const mappedCategory = mapCategoryAttributes(category.toJSON())
    const info = getInfoPagination({ ...pagination, count })
    const mappedProducts = products.map(product => mapCategoryProductAttributes(product.toJSON()))

    return res.status(200).json({ info, products: mappedProducts, category: category.name })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function createCategory (req: Request, res: Response) {
  try {
    console.log({ files: req.files })
    const result = validateCategory(req.body)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    const categoryCreated = await Create(result.data)

    const category = await GetById(categoryCreated.categoryId)

    if (category === null) {
      return res.sendStatus(201)
    }

    const mappedCategory = mapCategoryAttributes(category.toJSON())

    return res.status(201).json({ message: 'Category created', category: mappedCategory })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function updateCategory (req: Request, res: Response) {
  try {
    const result = partialCategory(req.body)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    const updatedCount = await UpdateById({ categoryId: req.params.categoryId, newCategory: result.data })

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Category not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

export async function deleteCategory (req: Request, res: Response) {
  try {
    const deletedCount = await DeleteById(req.params.categoryId)

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Category not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

export async function restoreCategory (req: Request, res: Response) {
  try {
    const categoryRestore = await RestoreById(req.params.categoryId)

    if (categoryRestore === null) {
      return res.status(404).json({ message: 'Category not found' })
    }

    return res.json({ message: 'Category restored', category: mapCategoryAttributes(categoryRestore.toJSON()) })
  } catch (error) {
    return handleError(error, res)
  }
}
