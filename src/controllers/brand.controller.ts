import { validateBrand } from '@/schemas/brand'
import { getInfoPagination, validatePagination } from '@/schemas/pagination'
import { validateSearch } from '@/schemas/query'
import { Create, DeleteById, GetAll, GetById, RestoreById } from '@/service/brand'
import { handleError } from '@/utils/errors'

import { mapBrandsAttributes } from '@/utils/mappers'
import { type Request, type Response } from 'express'

export async function getBrands (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const query = validateSearch(req.query)

    const { brand, count } = await GetAll({ ...pagination, ...query })

    const mappedBrands = brand.map((brand) => mapBrandsAttributes(brand.toJSON()))

    const info = getInfoPagination({ ...pagination, count })

    return res.status(200).json({ info, brand: mappedBrands })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function getbrandsDeleted (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const query = validateSearch(req.query)

    const { brand, count } = await GetAll({ ...pagination, ...query, getDeleted: true })
    const mappedBrands = brand.map((brand) => mapBrandsAttributes(brand.toJSON()))

    const info = getInfoPagination({ ...pagination, count })

    return res.status(200).json({ info, brand: mappedBrands })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function getBrandById (req: Request, res: Response) {
  try {
    const brand = await GetById(req.params.brandId)

    if (brand === null) {
      return res.status(404).json({ message: 'Brand not found' })
    }

    const mappedBrand = mapBrandsAttributes(brand.toJSON())

    return res.status(200).json({ category: mappedBrand })
  } catch (error) {
    return handleError(error, res)
  }
}
export async function createbrands (req: Request, res: Response) {
  try {
    console.log({ files: req.files })
    const result = validateBrand(req.body)

    if (!result.success) {
      return res.status(400).json({ message: 'Bad Request', errors: result.error })
    }

    const brandCreated = await Create(result.data)

    return res.status(201).json({ message: 'Brand created', brand: brandCreated.toJSON() })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al crear la marca' })
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