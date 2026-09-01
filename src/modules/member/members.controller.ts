import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
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
  MEMBER_DELETE_ROLES,
  MEMBER_READ_ROLES,
  MEMBER_WRITE_ROLES,
} from '../auth/roles.constants'
import { CreateMemberDto } from './dto/create-member.dto'
import { UpdateMemberDto } from './dto/update-member.dto'
import type { MemberListFilters } from './member-filters'
import { CreateMemberUseCase } from './use-cases/create-member.use-case'
import { ExportMembersPdfUseCase } from './use-cases/export-members-pdf.use-case'
import { FindAllMemberUseCase } from './use-cases/find-all.use-case'
import { FindBirthdaysMemberUseCase } from './use-cases/find-birthdays.use-case'
import { FindIdMemberUseCase } from './use-cases/find-id.use-case'
import { GetMemberStatsUseCase } from './use-cases/get-member-stats.use-case'
import { RemoveMemberUseCase } from './use-cases/remove-member.use-case'
import { StatusMemberUseCase } from './use-cases/status-member.use-case'
import { UpdateMemberUseCase } from './use-cases/update-member.use-case'

function readMemberFilters(
  q?: string,
  member_status?: string,
  ministry?: string,
  date_birth_from?: string,
  date_birth_to?: string,
  created_at_from?: string,
  created_at_to?: string,
): MemberListFilters {
  return {
    search: q,
    member_status,
    ministry,
    date_birth_from,
    date_birth_to,
    created_at_from,
    created_at_to,
  }
}

@ApiTags('Members')
@UseInterceptors(ResponseInterceptor)
@Controller('members')
export class MembersController {
  constructor(
    private readonly createMemberUseCase: CreateMemberUseCase,
    private readonly findAllMemberUseCase: FindAllMemberUseCase,
    private readonly exportMembersPdfUseCase: ExportMembersPdfUseCase,
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
  @ApiQuery({
    name: 'member_status',
    required: false,
    enum: ['ativo', 'inativo', 'visitante', 'transferido', 'falecido'],
  })
  @ApiQuery({
    name: 'ministry',
    required: false,
    type: String,
    description: 'Ministério (busca aproximada)',
  })
  @ApiQuery({
    name: 'date_birth_from',
    required: false,
    type: String,
    example: '1990-01-01',
  })
  @ApiQuery({
    name: 'date_birth_to',
    required: false,
    type: String,
    example: '2000-12-31',
  })
  @ApiQuery({
    name: 'created_at_from',
    required: false,
    type: String,
    example: '2026-01-01',
    description: 'Data inicial de cadastro',
  })
  @ApiQuery({
    name: 'created_at_to',
    required: false,
    type: String,
    example: '2026-12-31',
    description: 'Data final de cadastro',
  })
  @ApiOkResponse({ description: 'Membros recuperados com sucesso' })
  async findAll(
    @Paginate() query: PaginateQuery,
    @Query('q') q?: string,
    @Query('member_status') member_status?: string,
    @Query('ministry') ministry?: string,
    @Query('date_birth_from') date_birth_from?: string,
    @Query('date_birth_to') date_birth_to?: string,
    @Query('created_at_from') created_at_from?: string,
    @Query('created_at_to') created_at_to?: string,
  ) {
    const response = await this.findAllMemberUseCase.execute(
      withSearchQuery(query, q),
      readMemberFilters(
        q,
        member_status,
        ministry,
        date_birth_from,
        date_birth_to,
        created_at_from,
        created_at_to,
      ),
    )
    return toPaginatedHttpResponse(response, 'Membros recuperados com sucesso!')
  }

  @Get('export/pdf')
  @Roles(...MEMBER_READ_ROLES)
  @ApiOperation({ summary: 'Exportar relatório de membros em PDF' })
  @ApiProduces('application/pdf')
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({
    name: 'member_status',
    required: false,
    enum: ['ativo', 'inativo', 'visitante', 'transferido', 'falecido'],
  })
  @ApiQuery({ name: 'ministry', required: false, type: String })
  @ApiQuery({ name: 'date_birth_from', required: false, type: String })
  @ApiQuery({ name: 'date_birth_to', required: false, type: String })
  @ApiQuery({ name: 'created_at_from', required: false, type: String })
  @ApiQuery({ name: 'created_at_to', required: false, type: String })
  @ApiOkResponse({ description: 'PDF gerado com sucesso' })
  @Header('Content-Type', 'application/pdf')
  async exportPdf(
    @Query('q') q?: string,
    @Query('member_status') member_status?: string,
    @Query('ministry') ministry?: string,
    @Query('date_birth_from') date_birth_from?: string,
    @Query('date_birth_to') date_birth_to?: string,
    @Query('created_at_from') created_at_from?: string,
    @Query('created_at_to') created_at_to?: string,
  ) {
    const buffer = await this.exportMembersPdfUseCase.execute(
      readMemberFilters(
        q,
        member_status,
        ministry,
        date_birth_from,
        date_birth_to,
        created_at_from,
        created_at_to,
      ),
    )
    return new StreamableFile(buffer, {
      type: 'application/pdf',
      disposition: 'attachment; filename="relatorio-membros.pdf"',
    })
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
