import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateFinanceEntryDto } from '../dto/update-finance-entry.dto'
import { FinanceEntry } from '../entities/finance-entry.entity'

@Injectable()
export class UpdateFinanceEntryUseCase {
  constructor(
    @InjectRepository(FinanceEntry)
    private readonly financeEntryRepo: Repository<FinanceEntry>,
  ) {}

  async execute(id: string, input: UpdateFinanceEntryDto) {
    const entry = await this.financeEntryRepo.findOneOrFail({ where: { id } })

    input.type && (entry.type = input.type)
    input.category_id && (entry.category_id = input.category_id)
    input.amount !== undefined && (entry.amount = input.amount)
    input.entry_date && (entry.entry_date = input.entry_date)
    input.description !== undefined && (entry.description = input.description)
    input.payment_method && (entry.payment_method = input.payment_method)
    input.attachment !== undefined && (entry.attachment = input.attachment)

    return this.financeEntryRepo.save(entry)
  }
}
