import { type OrderProductsQuery } from '@/types/queries'
import { type OrderItem } from 'sequelize'

const orderProducts: Record<OrderProductsQuery, OrderItem> = {
  recents: ['createdAt', 'DESC'],
  'name-asc': ['name', 'ASC'],
  'name-desc': ['name', 'DESC'],
  'price-asc': ['price', 'ASC'],
  'price-desc': ['price', 'DESC']
}

interface GetOrderQuery {
  order?: OrderProductsQuery
}

export function getOrderProducts ({ order = 'recents' }: GetOrderQuery) {
  return orderProducts[order] ?? orderProducts.recents
}
