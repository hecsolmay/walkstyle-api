import { type OrderProductsQuery } from '@/types/queries'
import { type OrderItem } from 'sequelize'

const orderProducts: Record<OrderProductsQuery, OrderItem> = {
  recents: ['createdAt', 'DESC'],
  'name-asc': ['name', 'DESC'],
  'name-desc': ['name', 'ASC'],
  'price-asc': ['price', 'DESC'],
  'price-desc': ['price', 'ASC']
}

interface GetOrderQuery {
  order?: OrderProductsQuery
}

export function getOrderProducts ({ order = 'recents' }: GetOrderQuery) {
  return orderProducts[order] ?? orderProducts.recents
}
