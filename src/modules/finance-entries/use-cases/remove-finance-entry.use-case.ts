import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FinanceEntry } from '../entities/finance-entry.entity'

@Injectable()
export class RemoveFinanceEntryUseCase {
  constructor(
    @InjectRepository(FinanceEntry)
    private readonly financeEntryRepo: Repository<FinanceEntry>,
  ) {}

  async execute(id: string) {
    const entry = await this.financeEntryRepo.findOneOrFail({ where: { id } })
    return this.financeEntryRepo.remove(entry)
  }
}
