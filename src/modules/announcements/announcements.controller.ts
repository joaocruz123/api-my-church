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
import { CreateAnnouncementDto } from './dto/create-announcement.dto'
import { UpdateAnnouncementDto } from './dto/update-announcement.dto'
import { CreateAnnouncementUseCase } from './use-cases/create-announcement.use-case'
import { FindAllAnnouncementUseCase } from './use-cases/find-all.use-case'
import { FindIdAnnouncementUseCase } from './use-cases/find-id.use-case'
import { RemoveAnnouncementUseCase } from './use-cases/remove-announcement.use-case'
import { StatusAnnouncementUseCase } from './use-cases/status-announcement.use-case'
import { UpdateAnnouncementUseCase } from './use-cases/update-announcement.use-case'

@ApiTags('Announcements')
@UseInterceptors(ResponseInterceptor)
@Controller('announcements')
export class AnnouncementsController {
  constructor(
    private readonly createAnnouncementUseCase: CreateAnnouncementUseCase,
    private readonly findAllAnnouncementUseCase: FindAllAnnouncementUseCase,
    private readonly findIdAnnouncementUseCase: FindIdAnnouncementUseCase,
    private readonly updateAnnouncementUseCase: UpdateAnnouncementUseCase,
    private readonly statusAnnouncementUseCase: StatusAnnouncementUseCase,
    private readonly removeAnnouncementUseCase: RemoveAnnouncementUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar aviso' })
  @ApiCreatedResponse({ description: 'Aviso criado com sucesso' })
  create(@Body() createAnnouncementDto: CreateAnnouncementDto) {
    return this.createAnnouncementUseCase.execute(createAnnouncementDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar avisos (paginado)' })
  @ApiPaginateQuery()
  @ApiOkResponse({ description: 'Avisos recuperados com sucesso' })
  async findAll(@Paginate() query: PaginateQuery, @Query('q') q?: string) {
    const response = await this.findAllAnnouncementUseCase.execute(
      withSearchQuery(query, q),
    )
    return toPaginatedHttpResponse(response, 'Avisos recuperados com sucesso!')
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar aviso por ID' })
  @ApiParam({ name: 'id', description: 'ID do aviso' })
  @ApiOkResponse({ description: 'Aviso recuperado com sucesso' })
  async findOne(@Param('id') id: string) {
    const result = await this.findIdAnnouncementUseCase.execute(id)
    return {
      message: 'Aviso recuperado com sucesso!',
      result,
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar aviso' })
  @ApiParam({ name: 'id', description: 'ID do aviso' })
  @ApiOkResponse({ description: 'Aviso atualizado com sucesso' })
  async update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    const result = await this.updateAnnouncementUseCase.execute(
      id,
      updateAnnouncementDto,
    )
    return {
      message: 'Aviso atualizado com sucesso!',
      result,
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do aviso' })
  @ApiParam({ name: 'id', description: 'ID do aviso' })
  @ApiOkResponse({ description: 'Status do aviso atualizado com sucesso' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ) {
    const result = await this.statusAnnouncementUseCase.execute(
      id,
      updateAnnouncementDto,
    )
    return {
      message: 'Aviso com status atualizado com sucesso!',
      result,
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover aviso' })
  @ApiParam({ name: 'id', description: 'ID do aviso' })
  @ApiOkResponse({ description: 'Aviso removido com sucesso' })
  async remove(@Param('id') id: string) {
    const result = await this.removeAnnouncementUseCase.execute(id)
    return {
      message: 'Aviso removido com sucesso!',
      result,
    }
  }
}
