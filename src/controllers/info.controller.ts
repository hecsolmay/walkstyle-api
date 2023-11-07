import { validatePagination } from '@/schemas/pagination'
import { CountProducts } from '@/service/products'
import { GetAll as GetSales, GetTopSellingCategories, GetTopSellingProducts, GetTotalSales, GetTotalSalesAmount } from '@/service/sale'
import { CountUsers, GetAll as GetUsers } from '@/service/user'
import { handleError } from '@/utils/errors'
import { mapSaleAttributes, mapUserAttributes } from '@/utils/mappers'
import { parseDateString } from '@/utils/sort-query'
import { type Request, type Response } from 'express'

export async function GetInfoDashboard (req: Request, res: Response) {
  try {
    const dateStart = parseDateString(req.query.dateStart as string)
    dateStart.setDate(1)
    dateStart.setHours(0, 0, 0, 0)
    const dateEnd = parseDateString(req.query.dateEnd as string)

    const [totalSales, topSales, lestSales, topCategories] = await Promise.all([
      GetTotalSales({ dateStart, dateEnd }),
      GetTopSellingProducts({ dateStart, dateEnd }),
      GetTopSellingProducts({ dateStart, dateEnd, order: 'ASC' }),
      GetTopSellingCategories({ dateStart, dateEnd })
    ])

    return res.json({
      message: 'Info dashboard',
      totalSales,
      topProducts: topSales,
      topCategories,
      lestSoldProducts: lestSales
    })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function GetLatestInfo (req: Request, res: Response) {
  try {
    const { limit } = validatePagination(req.query)

    const [latestSales, latestUsers] = await Promise.all([
      GetSales({ order: 'recents', limit, page: 1, offset: 0 }),
      GetUsers({ order: 'recents', limit, q: '', page: 1, offset: 0 })
    ])

    const { sales } = latestSales
    const mappedSales = sales.map(sale => mapSaleAttributes(sale.toJSON()))

    const { users } = latestUsers
    const mappedUsers = users.map(user => mapUserAttributes(user.toJSON()))

    return res.json({ sales: mappedSales, users: mappedUsers })
  } catch (error) {
    return handleError(error, res)
  }
}

export async function GetCountInfo (req: Request, res: Response) {
  try {
    const date = parseDateString(req.query.date as string)

    const [usersCount, productsCount, totalSales] = await Promise.all([
      CountUsers(), // CANTIDAD DE USUARIOS
      CountProducts(), // CANTIDAD DE PRODUCTOS
      GetTotalSalesAmount({ dateStart: date }) // TOTAL DE LAS VENTAS
    ])

    return res.json({ users: usersCount, products: productsCount, totalSales })
  } catch (error) {
    return handleError(error, res)
  }
}
