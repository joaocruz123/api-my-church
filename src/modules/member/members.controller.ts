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
import { CreateMemberDto } from './dto/create-member.dto'
import { UpdateMemberDto } from './dto/update-member.dto'
import { CreateMemberUseCase } from './use-cases/create-member.use-case'
import { FindAllMemberUseCase } from './use-cases/find-all.use-case'
import { FindIdMemberUseCase } from './use-cases/find-id.use-case'
import { RemoveMemberUseCase } from './use-cases/remove-member.use-case'
import { StatusMemberUseCase } from './use-cases/status-member.use-case'
import { UpdateMemberUseCase } from './use-cases/update-member.use-case'

@ApiTags('Members')
@UseInterceptors(ResponseInterceptor)
@Controller('members')
export class MembersController {
  constructor(
    private readonly createMemberUseCase: CreateMemberUseCase,
    private readonly findAllMemberUseCase: FindAllMemberUseCase,
    private readonly findIdMemberUseCase: FindIdMemberUseCase,
    private readonly updateMemberUseCase: UpdateMemberUseCase,
    private readonly statusMemberUseCase: StatusMemberUseCase,
    private readonly removeMemberUseCase: RemoveMemberUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar membro' })
  @ApiCreatedResponse({ description: 'Membro criado com sucesso' })
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.createMemberUseCase.execute(createMemberDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar membros (paginado)' })
  @ApiPaginateQuery()
  @ApiOkResponse({ description: 'Membros recuperados com sucesso' })
  async findAll(@Paginate() query: PaginateQuery, @Query('q') q?: string) {
    const response = await this.findAllMemberUseCase.execute(
      withSearchQuery(query, q),
    )
    return toPaginatedHttpResponse(response, 'Membros recuperados com sucesso!')
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar membro por ID' })
  @ApiParam({ name: 'id', description: 'ID do membro' })
  @ApiOkResponse({ description: 'Membro recuperado com sucesso' })
  async findOne(@Param('id') id: string) {
    const result = await this.findIdMemberUseCase.execute(id)
    return {
      message: 'Membro recuperado com sucesso!',
      result,
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar membro' })
  @ApiParam({ name: 'id', description: 'ID do membro' })
  @ApiOkResponse({ description: 'Membro atualizado com sucesso' })
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    const result = await this.updateMemberUseCase.execute(id, updateMemberDto)
    return {
      message: 'Membro atualizado com sucesso!',
      result,
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do membro' })
  @ApiParam({ name: 'id', description: 'ID do membro' })
  @ApiOkResponse({ description: 'Status do membro atualizado com sucesso' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    const result = await this.statusMemberUseCase.execute(id, updateMemberDto)
    return {
      message: 'Membro com status atualizado com sucesso!',
      result,
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover membro' })
  @ApiParam({ name: 'id', description: 'ID do membro' })
  @ApiOkResponse({ description: 'Membro removido com sucesso' })
  async remove(@Param('id') id: string) {
    const result = await this.removeMemberUseCase.execute(id)
    return {
      message: 'Membro removido com sucesso!',
      result,
    }
  }
}
