import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FinanceCategory } from '../finance-categories/entities/finance-category.entity'
import { FinanceEntry } from './entities/finance-entry.entity'
import { FinanceEntriesController } from './finance-entries.controller'
import { CreateFinanceEntryUseCase } from './use-cases/create-finance-entry.use-case'
import { FindAllFinanceEntryUseCase } from './use-cases/find-all.use-case'
import { FindIdFinanceEntryUseCase } from './use-cases/find-id.use-case'
import { GetFinanceSummaryUseCase } from './use-cases/get-finance-summary.use-case'
import { RemoveFinanceEntryUseCase } from './use-cases/remove-finance-entry.use-case'
import { StatusFinanceEntryUseCase } from './use-cases/status-finance-entry.use-case'
import { UpdateFinanceEntryUseCase } from './use-cases/update-finance-entry.use-case'

@Module({
  imports: [TypeOrmModule.forFeature([FinanceEntry, FinanceCategory])],
  controllers: [FinanceEntriesController],
  providers: [
    CreateFinanceEntryUseCase,
    FindAllFinanceEntryUseCase,
    FindIdFinanceEntryUseCase,
    GetFinanceSummaryUseCase,
    UpdateFinanceEntryUseCase,
    StatusFinanceEntryUseCase,
    RemoveFinanceEntryUseCase,
  ],
})
export class FinanceEntriesModule {}
