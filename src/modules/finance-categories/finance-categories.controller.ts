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
import { CreateFinanceCategoryDto } from './dto/create-finance-category.dto'
import { UpdateFinanceCategoryDto } from './dto/update-finance-category.dto'
import { CreateFinanceCategoryUseCase } from './use-cases/create-finance-category.use-case'
import { FindAllFinanceCategoryUseCase } from './use-cases/find-all.use-case'
import { FindIdFinanceCategoryUseCase } from './use-cases/find-id.use-case'
import { RemoveFinanceCategoryUseCase } from './use-cases/remove-finance-category.use-case'
import { StatusFinanceCategoryUseCase } from './use-cases/status-finance-category.use-case'
import { UpdateFinanceCategoryUseCase } from './use-cases/update-finance-category.use-case'

@ApiTags('Finance Categories')
@UseInterceptors(ResponseInterceptor)
@Controller('finance-categories')
export class FinanceCategoriesController {
  constructor(
    private readonly createFinanceCategoryUseCase: CreateFinanceCategoryUseCase,
    private readonly findAllFinanceCategoryUseCase: FindAllFinanceCategoryUseCase,
    private readonly findIdFinanceCategoryUseCase: FindIdFinanceCategoryUseCase,
    private readonly updateFinanceCategoryUseCase: UpdateFinanceCategoryUseCase,
    private readonly statusFinanceCategoryUseCase: StatusFinanceCategoryUseCase,
    private readonly removeFinanceCategoryUseCase: RemoveFinanceCategoryUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar categoria financeira' })
  @ApiCreatedResponse({ description: 'Categoria financeira criada com sucesso' })
  create(@Body() createFinanceCategoryDto: CreateFinanceCategoryDto) {
    return this.createFinanceCategoryUseCase.execute(createFinanceCategoryDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar categorias financeiras (paginado)' })
  @ApiPaginateQuery()
  @ApiOkResponse({
    description: 'Categorias financeiras recuperadas com sucesso',
  })
  async findAll(@Paginate() query: PaginateQuery) {
    const response = await this.findAllFinanceCategoryUseCase.execute(query)
    return {
      message: 'Categorias financeiras recuperadas com sucesso!',
      result: response,
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar categoria financeira por ID' })
  @ApiParam({ name: 'id', description: 'ID da categoria financeira' })
  @ApiOkResponse({
    description: 'Categoria financeira recuperada com sucesso',
  })
  async findOne(@Param('id') id: string) {
    const result = await this.findIdFinanceCategoryUseCase.execute(id)
    return {
      message: 'Categoria financeira recuperada com sucesso!',
      result,
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar categoria financeira' })
  @ApiParam({ name: 'id', description: 'ID da categoria financeira' })
  @ApiOkResponse({
    description: 'Categoria financeira atualizada com sucesso',
  })
  async update(
    @Param('id') id: string,
    @Body() updateFinanceCategoryDto: UpdateFinanceCategoryDto,
  ) {
    const result = await this.updateFinanceCategoryUseCase.execute(
      id,
      updateFinanceCategoryDto,
    )
    return {
      message: 'Categoria financeira atualizada com sucesso!',
      result,
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status da categoria financeira' })
  @ApiParam({ name: 'id', description: 'ID da categoria financeira' })
  @ApiOkResponse({
    description: 'Status da categoria financeira atualizado com sucesso',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateFinanceCategoryDto: UpdateFinanceCategoryDto,
  ) {
    const result = await this.statusFinanceCategoryUseCase.execute(
      id,
      updateFinanceCategoryDto,
    )
    return {
      message: 'Categoria financeira com status atualizado com sucesso!',
      result,
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover categoria financeira' })
  @ApiParam({ name: 'id', description: 'ID da categoria financeira' })
  @ApiOkResponse({
    description: 'Categoria financeira removida com sucesso',
  })
  async remove(@Param('id') id: string) {
    const result = await this.removeFinanceCategoryUseCase.execute(id)
    return {
      message: 'Categoria financeira removida com sucesso!',
      result,
    }
  }
}
