import { getInfoPagination, validatePagination } from '@/schemas/pagination'
import { validateSale } from '@/schemas/sale'
import { Create, GetAll, GetById } from '@/service/sale'
import { NotFoundError, ZodValidationError, handleError } from '@/utils/errors'
import { mapSaleAttributes } from '@/utils/mappers'
import { type Request, type Response } from 'express'

export async function getSales (req: Request, res: Response) {
  try {
    const pagination = validatePagination(req.query)
    const order = req.query.order as any
    const { count, sales } = await GetAll({ ...pagination, order })

    const info = getInfoPagination({ ...pagination, count })

    const mappedSales = sales.map(sale => mapSaleAttributes(sale.toJSON()))

    return res.json({ info, sales: mappedSales })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function getSaleById (req: Request, res: Response) {
  try {
    const sale = await GetById(req.params.saleId)

    if (sale === null) {
      throw new NotFoundError('Sale not found')
    }

    return res.json({ sale: mapSaleAttributes(sale.toJSON()) })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function createSale (req: Request, res: Response) {
  try {
    const result = validateSale(req.body)

    if (!result.success) {
      throw new ZodValidationError(result.error)
    }

    const data = result.data

    const { products, userId } = data

    const saleCreated = await Create(userId, products)

    return res.json({ message: 'sale created', sale: saleCreated })
  } catch (error) {
    return handleError(error, res)
  }
}
