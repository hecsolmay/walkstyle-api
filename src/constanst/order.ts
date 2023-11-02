import { type OrderItem } from 'sequelize'

const CREATEAT_DESC: OrderItem = ['createdAt', 'DESC']
const CREATEAT_ASC: OrderItem = ['createdAt', 'ASC']
const NAME_ASC: OrderItem = ['name', 'ASC']
const NAME_DESC: OrderItem = ['name', 'DESC']
const PRICE_ASC: OrderItem = ['price', 'ASC']
const PRICE_DESC: OrderItem = ['price', 'DESC']

export const ORDER_TYPES = {
  createdAtDesc: CREATEAT_DESC,
  createdAtAsc: CREATEAT_ASC,
  nameAsc: NAME_ASC,
  nameDesc: NAME_DESC,
  priceAsc: PRICE_ASC,
  priceDesc: PRICE_DESC
}
