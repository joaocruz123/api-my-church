import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FinanceEntry } from '../entities/finance-entry.entity'

@Injectable()
export class FindIdFinanceEntryUseCase {
  constructor(
    @InjectRepository(FinanceEntry)
    private readonly financeEntryRepo: Repository<FinanceEntry>,
  ) {}

  execute(id: string) {
    return this.financeEntryRepo.findOneOrFail({ where: { id } })
  }
}
