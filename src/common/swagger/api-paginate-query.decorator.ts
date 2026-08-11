import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

export function ApiPaginateQuery() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Página atual',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: 20,
      description: 'Itens por página',
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      example: 'name:ASC',
      description: 'Ordenação no formato coluna:ASC|DESC',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Busca textual',
    }),
    ApiQuery({
      name: 'searchBy',
      required: false,
      type: String,
      description: 'Colunas usadas na busca (separadas por vírgula)',
    }),
    ApiQuery({
      name: 'filter',
      required: false,
      type: String,
      description: 'Filtros no formato filter.campo=valor',
    }),
  )
}
