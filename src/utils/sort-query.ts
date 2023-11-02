import { ORDER_TYPES } from '@/constanst/order'
import { type OrderProductsQuery } from '@/types/queries'
import { type OrderItem } from 'sequelize'

const orderProducts: Record<OrderProductsQuery, OrderItem> = {
  recents: ORDER_TYPES.createdAtDesc,
  'name-asc': ORDER_TYPES.nameAsc,
  'name-desc': ORDER_TYPES.nameDesc,
  'price-asc': ORDER_TYPES.priceAsc,
  'price-desc': ORDER_TYPES.priceDesc
}

interface GetOrderQuery {
  order?: OrderProductsQuery
}

export function getOrderProducts ({ order = 'recents' }: GetOrderQuery) {
  return orderProducts[order] ?? orderProducts.recents
}
