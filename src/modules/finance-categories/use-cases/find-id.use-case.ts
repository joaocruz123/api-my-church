import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FinanceCategory } from '../entities/finance-category.entity'

@Injectable()
export class FindIdFinanceCategoryUseCase {
  constructor(
    @InjectRepository(FinanceCategory)
    private readonly financeCategoryRepo: Repository<FinanceCategory>,
  ) {}

  execute(id: string) {
    return this.financeCategoryRepo.findOneOrFail({ where: { id } })
  }
}
