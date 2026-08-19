import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
  success: boolean
  message?: string
  data: T
  totalRegistros?: number
  paginaAtual?: number
  registrosPorPagina?: number
  totalPaginas?: number
}

const PAGINATION_KEYS = [
  'totalRegistros',
  'paginaAtual',
  'registrosPorPagina',
  'totalPaginas',
] as const

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const pagination = pickPagination(data)

        if (
          data &&
          typeof data === 'object' &&
          ('result' in data || 'message' in data)
        ) {
          return {
            success: data.success ?? true,
            message: data.message,
            data: data.result,
            ...pagination,
          }
        }

        return {
          success: true,
          message: undefined,
          data,
          ...pagination,
        }
      }),
    )
  }
}

function pickPagination(data: unknown) {
  if (!data || typeof data !== 'object') return {}

  const source = data as Record<string, unknown>
  const extra: Partial<
    Record<(typeof PAGINATION_KEYS)[number], number>
  > = {}

  for (const key of PAGINATION_KEYS) {
    if (key in source && source[key] != null) {
      extra[key] = Number(source[key])
    }
  }

  return extra
}
