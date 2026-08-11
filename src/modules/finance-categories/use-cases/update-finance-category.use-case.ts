import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateFinanceCategoryDto } from '../dto/update-finance-category.dto'
import { FinanceCategory } from '../entities/finance-category.entity'

@Injectable()
export class UpdateFinanceCategoryUseCase {
  constructor(
    @InjectRepository(FinanceCategory)
    private readonly financeCategoryRepo: Repository<FinanceCategory>,
  ) {}

  async execute(id: string, input: UpdateFinanceCategoryDto) {
    const category = await this.financeCategoryRepo.findOneOrFail({
      where: { id },
    })

    input.name && (category.name = input.name)
    input.type && (category.type = input.type)
    input.description !== undefined && (category.description = input.description)

    return this.financeCategoryRepo.save(category)
  }
}
