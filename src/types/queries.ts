import { type searchSchema } from '@/schemas/query'
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
