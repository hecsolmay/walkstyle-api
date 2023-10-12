import { type PaginationInfo, type PaginationQuery } from '@/types/queries'

const DEFAULT_LIMIT = 10
const DEFAULT_PAGE = 1

export function validatePagination (query: any = {}): PaginationQuery {
  // RECIBIMOS EL QUERY DE LA PAGINACIÓN QUE PUEDE SER INDEFINIDO Y LE ASIGNAMOS LOS VALORES POR DEFECTO
  const { page: queryPage = DEFAULT_PAGE, limit: queryLimit = DEFAULT_LIMIT } = query

  // VALIDAMOS QUE SEA UN NÚMERO ENTERO
  const parsedPage = parseInt(queryPage)
  const parsedLimit = parseInt(queryLimit)

  // VALIDAMOS QUE SEA MAYOR QUE CERO Y NO SEA UN STRING
  const page = (isNaN(parsedPage) || parsedPage <= 0) ? DEFAULT_PAGE : parsedPage
  const limit = (isNaN(parsedLimit) || parsedLimit <= 0) ? DEFAULT_LIMIT : parsedLimit

  // EL OFFSET ES EL NUMERO DE REGISTROS DE LA PAGINA * EL NUMERO DE REGISTROS POR PAGINA
  const offset = (page - 1) * limit

  return {
    page,
    limit,
    offset
  }
}

interface PaginationInfoParams extends Omit<PaginationQuery, 'offset'> {
  count: number
}

const DEFAULT_PAGINATION_QUERY: PaginationInfoParams = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
  count: 0
}

export function getInfoPagination (query: PaginationInfoParams = DEFAULT_PAGINATION_QUERY): PaginationInfo {
  // CON EL COUNT TOTAL DE LOS REGISTROS DE LA PAGINACIÓN PODREMOS OBTENER EL INFO DE LA PAGINACIÓN
  const { page, limit, count } = query

  // REDONDEAMOS EL NUMERO DE PAGINAS
  const pages = Math.ceil(count / limit)

  return {
    currentPage: page,
    limit,
    items: count,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
    nextPage: page < pages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  }
}
