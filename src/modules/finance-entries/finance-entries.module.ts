import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FinanceEntry } from './entities/finance-entry.entity'
import { FinanceEntriesController } from './finance-entries.controller'
import { CreateFinanceEntryUseCase } from './use-cases/create-finance-entry.use-case'
import { FindAllFinanceEntryUseCase } from './use-cases/find-all.use-case'
import { FindIdFinanceEntryUseCase } from './use-cases/find-id.use-case'
import { RemoveFinanceEntryUseCase } from './use-cases/remove-finance-entry.use-case'
import { StatusFinanceEntryUseCase } from './use-cases/status-finance-entry.use-case'
import { UpdateFinanceEntryUseCase } from './use-cases/update-finance-entry.use-case'

@Module({
  imports: [TypeOrmModule.forFeature([FinanceEntry])],
  controllers: [FinanceEntriesController],
  providers: [
    CreateFinanceEntryUseCase,
    FindAllFinanceEntryUseCase,
    FindIdFinanceEntryUseCase,
    UpdateFinanceEntryUseCase,
    StatusFinanceEntryUseCase,
    RemoveFinanceEntryUseCase,
  ],
})
export class FinanceEntriesModule {}
