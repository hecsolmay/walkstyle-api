import { partialBrand, validateBrand } from '@/schemas/brand'
import { getInfoPagination, validatePagination } from '@/schemas/pagination'
import { validateSearch } from '@/schemas/query'
import { Create, DeleteById, GetAll, GetById, RestoreById, UpdateById } from '@/service/brand'
import { GetAllByBrand } from '@/service/products'
import { NotFoundError, ZodValidationError, handleError } from '@/utils/errors'

import { mapBrandsAttributes, mapProductAttributes } from '@/utils/mappers'
import { type Request, type Response } from 'express'

export async function getBrands (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const query = validateSearch(req.query)
    const order = req.query.order as any

    const { brand, count } = await GetAll({ ...pagination, ...query, order })

    const mappedBrands = brand.map((brand) => mapBrandsAttributes(brand.toJSON()))

    const info = getInfoPagination({ ...pagination, count })

    return res.status(200).json({ info, brands: mappedBrands })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function getbrandsDeleted (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const query = validateSearch(req.query)

    const { brand, count } = await GetAll({ ...pagination, ...query, getDeleted: true })
    const mappedBrands = brand.map((brand) => mapBrandsAttributes(brand.toJSON(), true))

    const info = getInfoPagination({ ...pagination, count })

    return res.status(200).json({ info, brands: mappedBrands })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function getBrandById (req: Request, res: Response) {
  try {
    const brand = await GetById(req.params.brandId)

    if (brand === null) {
      throw new NotFoundError('Brand not found')
    }

    const mappedBrand = mapBrandsAttributes(brand.toJSON())

    return res.status(200).json({ category: mappedBrand })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function getProductsByBrand (req: Request, res: Response) {
  try {
    const brand = await GetById(req.params.brandId)
    const order = req.query.order ?? '' as any

    if (brand === null) {
      throw new NotFoundError('Brand not found')
    }

    const pagination = validatePagination(req.query)

    const { limit, offset } = pagination

    const { count, products } = await GetAllByBrand({ order, limit, offset, brandId: brand.brandId })

    const info = getInfoPagination({ ...pagination, count })

    const mappedProducts = products.map((product) => mapProductAttributes(product.toJSON()))

    return res.status(200).json({ info, products: mappedProducts, brand: brand.name })
  } catch (error) {
    return handleError(error, res)
  }
}
export async function createBrand (req: Request, res: Response) {
  try {
    const result = validateBrand(req.body)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    const brandCreated = await Create(result.data)

    return res.status(201).json({ message: 'Brand created', brand: brandCreated.toJSON() })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al crear la marca' })
  }
}

export async function updateBrand (req: Request, res: Response) {
  try {
    const result = partialBrand(req.body)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    const updatedCount = await UpdateById({ brandId: req.params.brandId, newBanner: result.data })

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Brand not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

export async function deleteBrand (req: Request, res: Response) {
  try {
    const deletedCount = await DeleteById(req.params.brandId)

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Brand not found' })
    }

    return res.sendStatus(204)
  } catch (error) {
    return handleError(error, res)
  }
}

export async function restoreBrand (req: Request, res: Response) {
  try {
    const brandRestore = await RestoreById(req.params.brandId)

    if (brandRestore === null) {
      return res.status(404).json({ message: 'Brand not found' })
    }

    return res.json({ message: 'Brand restored', brand: mapBrandsAttributes(brandRestore.toJSON()) })
  } catch (error) {
    return handleError(error, res)
  }
}
