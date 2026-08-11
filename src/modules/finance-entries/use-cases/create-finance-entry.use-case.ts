import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateFinanceEntryDto } from '../dto/create-finance-entry.dto'
import { FinanceEntry } from '../entities/finance-entry.entity'

@Injectable()
export class CreateFinanceEntryUseCase {
  constructor(
    @InjectRepository(FinanceEntry)
    private readonly financeEntryRepo: Repository<FinanceEntry>,
  ) {}

  execute(input: CreateFinanceEntryDto) {
    const entry = new FinanceEntry(input)
    return this.financeEntryRepo.save(entry)
  }
}
