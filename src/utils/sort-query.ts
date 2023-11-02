import { ORDER_TYPES } from '@/constanst/order'
import { type OrderDatesQuery, type OrderCommonQuery, type OrderProductsQuery } from '@/types/queries'
import { type OrderItem } from 'sequelize'

const orderProducts: Record<OrderProductsQuery, OrderItem> = {
  recents: ORDER_TYPES.createdAtDesc,
  oldest: ORDER_TYPES.createdAtAsc,
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

const orderCommons: Record<OrderCommonQuery, OrderItem> = {
  recents: ORDER_TYPES.createdAtDesc,
  oldest: ORDER_TYPES.createdAtAsc,
  'name-asc': ORDER_TYPES.nameAsc,
  'name-desc': ORDER_TYPES.nameDesc
}

export function getCommonOrder ({ order = 'recents' }: { order?: OrderCommonQuery }) {
  return orderCommons[order] ?? orderCommons.recents
}

const orderDates: Record<OrderDatesQuery, OrderItem> = {
  recents: ORDER_TYPES.createdAtDesc,
  oldest: ORDER_TYPES.createdAtAsc
}

export function getDateOrder ({ order = 'recents' }: { order?: OrderDatesQuery }) {
  return orderDates[order] ?? orderDates.recents
}
