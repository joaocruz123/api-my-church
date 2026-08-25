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
import {
  MEMBER_DELETE_ROLES,
  MEMBER_READ_ROLES,
  MEMBER_WRITE_ROLES,
} from '../auth/roles.constants'
import { CreateMemberDto } from './dto/create-member.dto'
import { UpdateMemberDto } from './dto/update-member.dto'
import { CreateMemberUseCase } from './use-cases/create-member.use-case'
import { FindAllMemberUseCase } from './use-cases/find-all.use-case'
import { FindBirthdaysMemberUseCase } from './use-cases/find-birthdays.use-case'
import { FindIdMemberUseCase } from './use-cases/find-id.use-case'
import { GetMemberStatsUseCase } from './use-cases/get-member-stats.use-case'
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
    private readonly findBirthdaysMemberUseCase: FindBirthdaysMemberUseCase,
    private readonly getMemberStatsUseCase: GetMemberStatsUseCase,
    private readonly findIdMemberUseCase: FindIdMemberUseCase,
    private readonly updateMemberUseCase: UpdateMemberUseCase,
    private readonly statusMemberUseCase: StatusMemberUseCase,
    private readonly removeMemberUseCase: RemoveMemberUseCase,
  ) {}

  @Post()
  @Roles(...MEMBER_WRITE_ROLES)
  @ApiOperation({ summary: 'Criar membro' })
  @ApiCreatedResponse({ description: 'Membro criado com sucesso' })
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.createMemberUseCase.execute(createMemberDto)
  }

  @Get()
  @Roles(...MEMBER_READ_ROLES)
  @ApiOperation({ summary: 'Listar membros (paginado)' })
  @ApiPaginateQuery()
  @ApiOkResponse({ description: 'Membros recuperados com sucesso' })
  async findAll(@Paginate() query: PaginateQuery, @Query('q') q?: string) {
    const response = await this.findAllMemberUseCase.execute(
      withSearchQuery(query, q),
    )
    return toPaginatedHttpResponse(response, 'Membros recuperados com sucesso!')
  }

  @Get('birthdays')
  @Roles(...MEMBER_READ_ROLES)
  @ApiOperation({ summary: 'Listar aniversariantes do mês' })
  @ApiOkResponse({ description: 'Aniversariantes recuperados com sucesso' })
  async findBirthdays(@Query('month') month?: string) {
    const parsedMonth = month ? Number(month) : undefined
    const result = await this.findBirthdaysMemberUseCase.execute(parsedMonth)
    return {
      message: 'Aniversariantes recuperados com sucesso!',
      result,
    }
  }

  @Get('stats')
  @Roles(...MEMBER_READ_ROLES)
  @ApiOperation({ summary: 'Totais de membros por status' })
  @ApiOkResponse({ description: 'Totais recuperados com sucesso' })
  async stats() {
    const result = await this.getMemberStatsUseCase.execute()
    return {
      message: 'Totais recuperados com sucesso!',
      result,
    }
  }

  @Get(':id')
  @Roles(...MEMBER_READ_ROLES)
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
  @Roles(...MEMBER_WRITE_ROLES)
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
  @Roles(...MEMBER_WRITE_ROLES)
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
  @Roles(...MEMBER_DELETE_ROLES)
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
