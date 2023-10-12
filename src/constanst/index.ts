import { type PaginationWithSearch } from '@/types/queries'

export const ApiEndpoints = ['/api']
export const VALID_IMAGE_EXTENSION = ['.jpg', '.jpeg', '.png']
export const FILE_SIZE_NUMBER = 5
export const MAX_FILE_SIZE = FILE_SIZE_NUMBER * 1024 * 1024
export const THUMBNAIL_PARAMS = 'c_fill,h_150,w_150'
export const PREVIEW_PARAMS = 'c_fill,h_350,w_350'
export const DEFAULT_PAGINATION_WITH_SEARCH: PaginationWithSearch = {
  limit: 10,
  offset: 0,
  q: '',
  page: 1
}
