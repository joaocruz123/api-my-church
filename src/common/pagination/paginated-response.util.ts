import type { PaginateQuery, Paginated } from 'nestjs-paginate'

export const PAGINATE_DEFAULTS = {
  defaultLimit: 10,
  maxLimit: 100,
} as const

export function withSearchQuery(
  query: PaginateQuery,
  q?: string,
): PaginateQuery {
  const search = (query.search ?? q ?? '').trim()
  return {
    ...query,
    search: search || undefined,
  }
}

export function toPaginatedHttpResponse<T>(
  paginated: Paginated<T>,
  message: string,
) {
  return {
    message,
    result: paginated.data,
    totalRegistros: paginated.meta.totalItems ?? 0,
    paginaAtual: paginated.meta.currentPage ?? 1,
    registrosPorPagina: paginated.meta.itemsPerPage ?? paginated.data.length,
    totalPaginas: Math.max(1, paginated.meta.totalPages ?? 1),
  }
}
