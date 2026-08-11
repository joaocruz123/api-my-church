import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FinanceCategory } from './entities/finance-category.entity'
import { FinanceCategoriesController } from './finance-categories.controller'
import { CreateFinanceCategoryUseCase } from './use-cases/create-finance-category.use-case'
import { FindAllFinanceCategoryUseCase } from './use-cases/find-all.use-case'
import { FindIdFinanceCategoryUseCase } from './use-cases/find-id.use-case'
import { RemoveFinanceCategoryUseCase } from './use-cases/remove-finance-category.use-case'
import { StatusFinanceCategoryUseCase } from './use-cases/status-finance-category.use-case'
import { UpdateFinanceCategoryUseCase } from './use-cases/update-finance-category.use-case'

@Module({
  imports: [TypeOrmModule.forFeature([FinanceCategory])],
  controllers: [FinanceCategoriesController],
  providers: [
    CreateFinanceCategoryUseCase,
    FindAllFinanceCategoryUseCase,
    FindIdFinanceCategoryUseCase,
    UpdateFinanceCategoryUseCase,
    StatusFinanceCategoryUseCase,
    RemoveFinanceCategoryUseCase,
  ],
  exports: [TypeOrmModule],
})
export class FinanceCategoriesModule {}
