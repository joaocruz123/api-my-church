import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { FinanceCategory } from '../entities/finance-category.entity'

@Injectable()
export class FindAllFinanceCategoryUseCase {
  constructor(
    @InjectRepository(FinanceCategory)
    private readonly financeCategoryRepo: Repository<FinanceCategory>,
  ) {}

  execute(query: PaginateQuery): Promise<Paginated<FinanceCategory>> {
    return paginate(query, this.financeCategoryRepo, {
      sortableColumns: ['id', 'name', 'type', 'created_at', 'status'],
      defaultSortBy: [['name', 'ASC']],
      searchableColumns: ['name', 'description'],
      filterableColumns: {
        type: true,
        status: true,
      },
      select: ['id', 'name', 'type', 'description', 'status', 'created_at'],
    })
  }
}
