import { validateCategory } from '@/schemas/category'
import { getInfoPagination, validatePagination } from '@/schemas/pagination'
import { validateSearch } from '@/schemas/query'
import { Create, GetAll, GetById } from '@/service/category'
import { handleError } from '@/utils/errors'
import { mapCategoryAttributes } from '@/utils/mappers'
import { type Request, type Response } from 'express'

export async function getCategories (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const query = validateSearch(req.query)

    const { categories, count } = await GetAll({ ...pagination, ...query })

    const mappedCategories = categories.map(category => mapCategoryAttributes(category.toJSON()))

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

export async function createCategory (req: Request, res: Response) {
  try {
    console.log({ files: req.files })
    const result = validateCategory(req.body)

    if (!result.success) {
      return res.status(400).json({ message: 'Bad Request', errors: result.error })
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
