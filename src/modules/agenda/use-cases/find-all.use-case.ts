import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { PAGINATE_DEFAULTS } from '../../../common/pagination/paginated-response.util'
import { AgendaItem } from '../entities/agenda-item.entity'

@Injectable()
export class FindAllAgendaItemUseCase {
  constructor(
    @InjectRepository(AgendaItem)
    private readonly agendaItemRepo: Repository<AgendaItem>,
  ) {}

  execute(query: PaginateQuery): Promise<Paginated<AgendaItem>> {
    return paginate(query, this.agendaItemRepo, {
      sortableColumns: [
        'id',
        'title',
        'type',
        'starts_at',
        'item_status',
        'created_at',
        'status',
      ],
      defaultSortBy: [['starts_at', 'ASC']],
      searchableColumns: ['title', 'description', 'location'],
      filterableColumns: {
        type: true,
        item_status: true,
        status: true,
      },
      select: [
        'id',
        'title',
        'description',
        'starts_at',
        'ends_at',
        'location',
        'type',
        'responsible',
        'item_status',
        'created_by',
        'status',
        'created_at',
      ],
      defaultLimit: PAGINATE_DEFAULTS.defaultLimit,
      maxLimit: PAGINATE_DEFAULTS.maxLimit,
    })
  }
}
