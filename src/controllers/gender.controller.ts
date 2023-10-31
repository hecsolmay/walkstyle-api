import { validateGender } from '@/schemas/gender'
import { getInfoPagination, validatePagination } from '@/schemas/pagination'
import { GetOneGender } from '@/service/gender'
import { GetAllProductsByGender } from '@/service/products'
import { handleError } from '@/utils/errors'
import { mapProductAttributes } from '@/utils/mappers'
import { type Request, type Response } from 'express'

export async function GetProductsByGender (req: Request, res: Response) {
  try {
    const genderFromReq = validateGender(req.params.gender)
    const pagination = validatePagination(req.query)
    const order = req.query.order ?? '' as any

    const gender = await GetOneGender(genderFromReq)

    const { limit, offset } = pagination
    const { count, products } = await GetAllProductsByGender({ order, limit, offset, genderId: gender?.genderId })

    const info = getInfoPagination({ ...pagination, count })
    const mappedProducts = products.map(product => mapProductAttributes(product.toJSON()))
    return res.json({ info, products: mappedProducts })
  } catch (error) {
    return handleError(error, res)
  }
}
