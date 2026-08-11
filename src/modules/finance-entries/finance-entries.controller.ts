import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import type { PaginateQuery } from 'nestjs-paginate'
import { Paginate } from 'nestjs-paginate'
import { ApiPaginateQuery } from '../../common/swagger/api-paginate-query.decorator'
import { ResponseInterceptor } from '../../response.interceptor'
import { CreateFinanceEntryDto } from './dto/create-finance-entry.dto'
import { UpdateFinanceEntryDto } from './dto/update-finance-entry.dto'
import { CreateFinanceEntryUseCase } from './use-cases/create-finance-entry.use-case'
import { FindAllFinanceEntryUseCase } from './use-cases/find-all.use-case'
import { FindIdFinanceEntryUseCase } from './use-cases/find-id.use-case'
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
    private readonly findIdFinanceEntryUseCase: FindIdFinanceEntryUseCase,
    private readonly updateFinanceEntryUseCase: UpdateFinanceEntryUseCase,
    private readonly statusFinanceEntryUseCase: StatusFinanceEntryUseCase,
    private readonly removeFinanceEntryUseCase: RemoveFinanceEntryUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar lançamento financeiro' })
  @ApiCreatedResponse({
    description: 'Lançamento financeiro criado com sucesso',
  })
  create(@Body() createFinanceEntryDto: CreateFinanceEntryDto) {
    return this.createFinanceEntryUseCase.execute(createFinanceEntryDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar lançamentos financeiros (paginado)' })
  @ApiPaginateQuery()
  @ApiOkResponse({
    description: 'Lançamentos financeiros recuperados com sucesso',
  })
  async findAll(@Paginate() query: PaginateQuery) {
    const response = await this.findAllFinanceEntryUseCase.execute(query)
    return {
      message: 'Lançamentos financeiros recuperados com sucesso!',
      result: response,
    }
  }

  @Get(':id')
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
