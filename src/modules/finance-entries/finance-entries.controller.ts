import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import type { PaginateQuery } from 'nestjs-paginate'
import { Paginate } from 'nestjs-paginate'
import {
  toPaginatedHttpResponse,
  withSearchQuery,
} from '../../common/pagination/paginated-response.util'
import { ApiPaginateQuery } from '../../common/swagger/api-paginate-query.decorator'
import { ResponseInterceptor } from '../../response.interceptor'
import { Roles } from '../auth/decorators/roles.decorator'
import {
  FINANCE_READ_ROLES,
  FINANCE_WRITE_ROLES,
} from '../auth/roles.constants'
import { CreateFinanceEntryDto } from './dto/create-finance-entry.dto'
import { UpdateFinanceEntryDto } from './dto/update-finance-entry.dto'
import { CreateFinanceEntryUseCase } from './use-cases/create-finance-entry.use-case'
import { FindAllFinanceEntryUseCase } from './use-cases/find-all.use-case'
import { FindIdFinanceEntryUseCase } from './use-cases/find-id.use-case'
import { GetFinanceDailySummaryUseCase } from './use-cases/get-finance-daily-summary.use-case'
import { GetFinanceSummaryUseCase } from './use-cases/get-finance-summary.use-case'
import { GetFinanceYearlySummaryUseCase } from './use-cases/get-finance-yearly-summary.use-case'
import { RemoveFinanceEntryUseCase } from './use-cases/remove-finance-entry.use-case'
import { StatusFinanceEntryUseCase } from './use-cases/status-finance-entry.use-case'
import { UpdateFinanceEntryUseCase } from './use-cases/update-finance-entry.use-case'

@ApiTags('Finance Entries')
@UseInterceptors(ResponseInterceptor)
@Controller('finance-entries')
export class FinanceEntriesController {
  constructor(
    private readonly createFinanceEntryUseCase: CreateFinanceEntryUseCase,
    private readonly findAllFinanceEntryUseCase: FindAllFinanceEntryUseCase,
    private readonly getFinanceSummaryUseCase: GetFinanceSummaryUseCase,
    private readonly getFinanceYearlySummaryUseCase: GetFinanceYearlySummaryUseCase,
    private readonly getFinanceDailySummaryUseCase: GetFinanceDailySummaryUseCase,
    private readonly findIdFinanceEntryUseCase: FindIdFinanceEntryUseCase,
    private readonly updateFinanceEntryUseCase: UpdateFinanceEntryUseCase,
    private readonly statusFinanceEntryUseCase: StatusFinanceEntryUseCase,
    private readonly removeFinanceEntryUseCase: RemoveFinanceEntryUseCase,
  ) {}

  @Post()
  @Roles(...FINANCE_WRITE_ROLES)
  @ApiOperation({ summary: 'Criar lançamento financeiro' })
  @ApiCreatedResponse({
    description: 'Lançamento financeiro criado com sucesso',
  })
  create(@Body() createFinanceEntryDto: CreateFinanceEntryDto) {
    return this.createFinanceEntryUseCase.execute(createFinanceEntryDto)
  }

  @Get()
  @Roles(...FINANCE_READ_ROLES)
  @ApiOperation({ summary: 'Listar lançamentos financeiros (paginado)' })
  @ApiPaginateQuery()
  @ApiOkResponse({
    description: 'Lançamentos financeiros recuperados com sucesso',
  })
  async findAll(@Paginate() query: PaginateQuery, @Query('q') q?: string) {
    const response = await this.findAllFinanceEntryUseCase.execute(
      withSearchQuery(query, q),
    )
    return toPaginatedHttpResponse(
      response,
      'Lançamentos financeiros recuperados com sucesso!',
    )
  }

  @Get('summary')
  @Roles(...FINANCE_READ_ROLES)
  @ApiOperation({ summary: 'Balanço mensal e saldo acumulado' })
  @ApiOkResponse({ description: 'Resumo financeiro recuperado com sucesso' })
  async summary(
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const now = new Date()
    const parsedYear = year ? Number(year) : now.getFullYear()
    const parsedMonth = month ? Number(month) : now.getMonth() + 1
    const result = await this.getFinanceSummaryUseCase.execute(
      parsedYear,
      parsedMonth,
    )
    return {
      message: 'Resumo financeiro recuperado com sucesso!',
      result,
    }
  }

  @Get('summary/yearly')
  @Roles(...FINANCE_READ_ROLES)
  @ApiOperation({ summary: 'Balanço anual de entradas e saídas por mês' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiOkResponse({
    description: 'Resumo financeiro anual recuperado com sucesso',
  })
  async yearlySummary(@Query('year') year?: string) {
    const parsedYear = year ? Number(year) : new Date().getFullYear()
    const result =
      await this.getFinanceYearlySummaryUseCase.execute(parsedYear)
    return {
      message: 'Resumo financeiro anual recuperado com sucesso!',
      result,
    }
  }

  @Get('summary/daily')
  @Roles(...FINANCE_READ_ROLES)
  @ApiOperation({ summary: 'Balanço diário de entradas e saídas do mês' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiOkResponse({
    description: 'Resumo financeiro diário recuperado com sucesso',
  })
  async dailySummary(
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const now = new Date()
    const parsedYear = year ? Number(year) : now.getFullYear()
    const parsedMonth = month ? Number(month) : now.getMonth() + 1
    const result = await this.getFinanceDailySummaryUseCase.execute(
      parsedYear,
      parsedMonth,
    )
    return {
      message: 'Resumo financeiro diário recuperado com sucesso!',
      result,
    }
  }

  @Get(':id')
  @Roles(...FINANCE_READ_ROLES)
  @ApiOperation({ summary: 'Buscar lançamento financeiro por ID' })
  @ApiParam({ name: 'id', description: 'ID do lançamento financeiro' })
  @ApiOkResponse({
    description: 'Lançamento financeiro recuperado com sucesso',
  })
  async findOne(@Param('id') id: string) {
    const result = await this.findIdFinanceEntryUseCase.execute(id)
    return {
      message: 'Lançamento financeiro recuperado com sucesso!',
      result,
    }
  }

  @Patch(':id')
  @Roles(...FINANCE_WRITE_ROLES)
  @ApiOperation({ summary: 'Atualizar lançamento financeiro' })
  @ApiParam({ name: 'id', description: 'ID do lançamento financeiro' })
  @ApiOkResponse({
    description: 'Lançamento financeiro atualizado com sucesso',
  })
  async update(
    @Param('id') id: string,
    @Body() updateFinanceEntryDto: UpdateFinanceEntryDto,
  ) {
    const result = await this.updateFinanceEntryUseCase.execute(
      id,
      updateFinanceEntryDto,
    )
    return {
      message: 'Lançamento financeiro atualizado com sucesso!',
      result,
    }
  }

  @Patch(':id/status')
  @Roles(...FINANCE_WRITE_ROLES)
  @ApiOperation({ summary: 'Atualizar status do lançamento financeiro' })
  @ApiParam({ name: 'id', description: 'ID do lançamento financeiro' })
  @ApiOkResponse({
    description: 'Status do lançamento financeiro atualizado com sucesso',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateFinanceEntryDto: UpdateFinanceEntryDto,
  ) {
    const result = await this.statusFinanceEntryUseCase.execute(
      id,
      updateFinanceEntryDto,
    )
    return {
      message: 'Lançamento financeiro com status atualizado com sucesso!',
      result,
    }
  }

  @Delete(':id')
  @Roles(...FINANCE_WRITE_ROLES)
  @ApiOperation({ summary: 'Remover lançamento financeiro' })
  @ApiParam({ name: 'id', description: 'ID do lançamento financeiro' })
  @ApiOkResponse({
    description: 'Lançamento financeiro removido com sucesso',
  })
  async remove(@Param('id') id: string) {
    const result = await this.removeFinanceEntryUseCase.execute(id)
    return {
      message: 'Lançamento financeiro removido com sucesso!',
      result,
    }
  }
}
