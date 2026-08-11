import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateFinanceCategoryDto } from '../dto/create-finance-category.dto'
import { FinanceCategory } from '../entities/finance-category.entity'

@Injectable()
export class CreateFinanceCategoryUseCase {
  constructor(
    @InjectRepository(FinanceCategory)
    private readonly financeCategoryRepo: Repository<FinanceCategory>,
  ) {}

  execute(input: CreateFinanceCategoryDto) {
    const category = new FinanceCategory(input)
    return this.financeCategoryRepo.save(category)
  }
}
