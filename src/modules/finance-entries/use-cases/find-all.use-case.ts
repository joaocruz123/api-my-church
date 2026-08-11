import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { FinanceEntry } from '../entities/finance-entry.entity'

@Injectable()
export class FindAllFinanceEntryUseCase {
  constructor(
    @InjectRepository(FinanceEntry)
    private readonly financeEntryRepo: Repository<FinanceEntry>,
  ) {}

  execute(query: PaginateQuery): Promise<Paginated<FinanceEntry>> {
    return paginate(query, this.financeEntryRepo, {
      sortableColumns: [
        'id',
        'type',
        'amount',
        'entry_date',
        'payment_method',
        'created_at',
        'status',
      ],
      defaultSortBy: [['entry_date', 'DESC']],
      searchableColumns: ['description'],
      filterableColumns: {
        type: true,
        category_id: true,
        payment_method: true,
        entry_status: true,
        status: true,
      },
      select: [
        'id',
        'type',
        'category_id',
        'amount',
        'entry_date',
        'description',
        'payment_method',
        'created_by',
        'entry_status',
        'status',
        'created_at',
      ],
    })
  }
}
