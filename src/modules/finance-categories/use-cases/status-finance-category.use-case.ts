import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateFinanceCategoryDto } from '../dto/update-finance-category.dto'
import { FinanceCategory } from '../entities/finance-category.entity'

@Injectable()
export class StatusFinanceCategoryUseCase {
  constructor(
    @InjectRepository(FinanceCategory)
    private readonly financeCategoryRepo: Repository<FinanceCategory>,
  ) {}

  async execute(id: string, input: UpdateFinanceCategoryDto) {
    const category = await this.financeCategoryRepo.findOneOrFail({
      where: { id },
    })
    if (input.status !== undefined) category.status = input.status

    return this.financeCategoryRepo.save(category)
  }
}
