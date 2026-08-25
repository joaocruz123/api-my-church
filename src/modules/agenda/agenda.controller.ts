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
import { MURAL_READ_ROLES, MURAL_WRITE_ROLES } from '../auth/roles.constants'
import { CreateAgendaItemDto } from './dto/create-agenda-item.dto'
import { UpdateAgendaItemDto } from './dto/update-agenda-item.dto'
import { CreateAgendaItemUseCase } from './use-cases/create-agenda-item.use-case'
import { FindAllAgendaItemUseCase } from './use-cases/find-all.use-case'
import { FindCalendarAgendaItemUseCase } from './use-cases/find-calendar.use-case'
import { FindIdAgendaItemUseCase } from './use-cases/find-id.use-case'
import { RemoveAgendaItemUseCase } from './use-cases/remove-agenda-item.use-case'
import { StatusAgendaItemUseCase } from './use-cases/status-agenda-item.use-case'
import { UpdateAgendaItemUseCase } from './use-cases/update-agenda-item.use-case'

@ApiTags('Agenda')
@UseInterceptors(ResponseInterceptor)
@Controller('agenda')
export class AgendaController {
  constructor(
    private readonly createAgendaItemUseCase: CreateAgendaItemUseCase,
    private readonly findAllAgendaItemUseCase: FindAllAgendaItemUseCase,
    private readonly findCalendarAgendaItemUseCase: FindCalendarAgendaItemUseCase,
    private readonly findIdAgendaItemUseCase: FindIdAgendaItemUseCase,
    private readonly updateAgendaItemUseCase: UpdateAgendaItemUseCase,
    private readonly statusAgendaItemUseCase: StatusAgendaItemUseCase,
    private readonly removeAgendaItemUseCase: RemoveAgendaItemUseCase,
  ) {}

  @Post()
  @Roles(...MURAL_WRITE_ROLES)
  @ApiOperation({ summary: 'Criar item da agenda' })
  @ApiCreatedResponse({ description: 'Item da agenda criado com sucesso' })
  create(@Body() createAgendaItemDto: CreateAgendaItemDto) {
    return this.createAgendaItemUseCase.execute(createAgendaItemDto)
  }

  @Get()
  @Roles(...MURAL_READ_ROLES)
  @ApiOperation({ summary: 'Listar itens da agenda (paginado)' })
  @ApiPaginateQuery()
  @ApiOkResponse({ description: 'Itens da agenda recuperados com sucesso' })
  async findAll(@Paginate() query: PaginateQuery, @Query('q') q?: string) {
    const response = await this.findAllAgendaItemUseCase.execute(
      withSearchQuery(query, q),
    )
    return toPaginatedHttpResponse(
      response,
      'Itens da agenda recuperados com sucesso!',
    )
  }

  @Get('calendar')
  @Roles(...MURAL_READ_ROLES)
  @ApiOperation({ summary: 'Itens da agenda no mês (visão calendário)' })
  @ApiOkResponse({ description: 'Itens do mês recuperados com sucesso' })
  async calendar(
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const now = new Date()
    const parsedYear = year ? Number(year) : now.getFullYear()
    const parsedMonth = month ? Number(month) : now.getMonth() + 1
    const result = await this.findCalendarAgendaItemUseCase.execute(
      parsedYear,
      parsedMonth,
    )
    return {
      message: 'Itens da agenda recuperados com sucesso!',
      result,
    }
  }

  @Get(':id')
  @Roles(...MURAL_READ_ROLES)
  @ApiOperation({ summary: 'Buscar item da agenda por ID' })
  @ApiParam({ name: 'id', description: 'ID do item da agenda' })
  @ApiOkResponse({ description: 'Item da agenda recuperado com sucesso' })
  async findOne(@Param('id') id: string) {
    const result = await this.findIdAgendaItemUseCase.execute(id)
    return {
      message: 'Item da agenda recuperado com sucesso!',
      result,
    }
  }

  @Patch(':id')
  @Roles(...MURAL_WRITE_ROLES)
  @ApiOperation({ summary: 'Atualizar item da agenda' })
  @ApiParam({ name: 'id', description: 'ID do item da agenda' })
  @ApiOkResponse({ description: 'Item da agenda atualizado com sucesso' })
  async update(
    @Param('id') id: string,
    @Body() updateAgendaItemDto: UpdateAgendaItemDto,
  ) {
    const result = await this.updateAgendaItemUseCase.execute(
      id,
      updateAgendaItemDto,
    )
    return {
      message: 'Item da agenda atualizado com sucesso!',
      result,
    }
  }

  @Patch(':id/status')
  @Roles(...MURAL_WRITE_ROLES)
  @ApiOperation({ summary: 'Atualizar status do item da agenda' })
  @ApiParam({ name: 'id', description: 'ID do item da agenda' })
  @ApiOkResponse({
    description: 'Status do item da agenda atualizado com sucesso',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateAgendaItemDto: UpdateAgendaItemDto,
  ) {
    const result = await this.statusAgendaItemUseCase.execute(
      id,
      updateAgendaItemDto,
    )
    return {
      message: 'Item da agenda com status atualizado com sucesso!',
      result,
    }
  }

  @Delete(':id')
  @Roles(...MURAL_WRITE_ROLES)
  @ApiOperation({ summary: 'Remover item da agenda' })
  @ApiParam({ name: 'id', description: 'ID do item da agenda' })
  @ApiOkResponse({ description: 'Item da agenda removido com sucesso' })
  async remove(@Param('id') id: string) {
    const result = await this.removeAgendaItemUseCase.execute(id)
    return {
      message: 'Item da agenda removido com sucesso!',
      result,
    }
  }
}
