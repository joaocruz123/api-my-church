import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FinanceCategory } from '../entities/finance-category.entity'

@Injectable()
export class RemoveFinanceCategoryUseCase {
  constructor(
    @InjectRepository(FinanceCategory)
    private readonly financeCategoryRepo: Repository<FinanceCategory>,
  ) {}

  async execute(id: string) {
    const category = await this.financeCategoryRepo.findOneOrFail({
      where: { id },
    })
    return this.financeCategoryRepo.remove(category)
  }
}
