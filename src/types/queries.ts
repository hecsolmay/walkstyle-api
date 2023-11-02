import { type searchSchema } from '@/schemas/query'
import { type UserAttributes } from '@/types/attributes'
import { type Request } from 'express'
import { type z } from 'zod'

export interface PaginationQuery {
  page: number
  limit: number
  offset: number
}

export interface PaginationInfo {
  currentPage: number
  limit: number
  pages: number
  items: number
  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
}

export type SearchParam = z.infer<typeof searchSchema>

export interface PaginationWithSearch extends PaginationQuery, SearchParam {}
export interface QueryWithDeleted extends PaginationWithSearch {
  getDeleted?: boolean
}

export interface RequestWithUser extends Request {
  user: UserAttributes
}

export type OrderDatesQuery = 'recents' | 'oldest'
export type OrderCommonQuery = OrderDatesQuery | 'name-asc' | 'name-desc'
export type OrderProductsQuery = OrderCommonQuery | 'price-asc' | 'price-desc'
export interface ProductPaginationWithSearch extends PaginationWithSearch {
  order?: OrderProductsQuery
}
export interface ProductQueryWithDeleted extends ProductPaginationWithSearch {
  getDeleted?: boolean
}

export interface QueryWithDeletedSort extends QueryWithDeleted {
  order?: OrderCommonQuery
}
