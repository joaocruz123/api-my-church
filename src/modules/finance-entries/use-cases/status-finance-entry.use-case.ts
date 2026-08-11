import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateFinanceEntryDto } from '../dto/update-finance-entry.dto'
import { FinanceEntry } from '../entities/finance-entry.entity'

@Injectable()
export class StatusFinanceEntryUseCase {
  constructor(
    @InjectRepository(FinanceEntry)
    private readonly financeEntryRepo: Repository<FinanceEntry>,
  ) {}

  async execute(id: string, input: UpdateFinanceEntryDto) {
    const entry = await this.financeEntryRepo.findOneOrFail({ where: { id } })

    if (input.status !== undefined) entry.status = input.status
    if (input.entry_status !== undefined) entry.entry_status = input.entry_status

    return this.financeEntryRepo.save(entry)
  }
}
