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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { Roles } from '../auth/decorators/roles.decorator'
import type { PaginateQuery } from 'nestjs-paginate'
import { Paginate } from 'nestjs-paginate'
import {
  toPaginatedHttpResponse,
  withSearchQuery,
} from '../../common/pagination/paginated-response.util'
import { ApiPaginateQuery } from '../../common/swagger/api-paginate-query.decorator'
import { ResponseInterceptor } from '../../response.interceptor'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserUseCase } from './use-cases/create-user.use-case'
import { FindAllUserUseCase } from './use-cases/find-all.use-case'
import { FindIdUserUseCase } from './use-cases/find-id.use-case'
import { RemoveUserUseCase } from './use-cases/remove-user.use-case'
import { StatusUserUseCase } from './use-cases/status-user.use-case'
import { UpdateUserUseCase } from './use-cases/update-user.use-case'

@ApiTags('Users')
@ApiBearerAuth()
@Roles('admin')
@UseInterceptors(ResponseInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly findIdUserUseCase: FindIdUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly statusUserUseCase: StatusUserUseCase,
    private readonly removeUserUseCase: RemoveUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar usuário' })
  @ApiCreatedResponse({ description: 'Usuário criado com sucesso' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto)
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuários (paginado)' })
  @ApiPaginateQuery()
  @ApiOkResponse({ description: 'Usuários recuperados com sucesso' })
  async findAll(@Paginate() query: PaginateQuery, @Query('q') q?: string) {
    const response = await this.findAllUserUseCase.execute(
      withSearchQuery(query, q),
    )
    return toPaginatedHttpResponse(
      response,
      'Usuários recuperados com sucesso!',
    )
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiOkResponse({ description: 'Usuário recuperado com sucesso' })
  async findOne(@Param('id') id: string) {
    const result = await this.findIdUserUseCase.execute(id)
    return {
      message: 'Usuário recuperado com sucesso!',
      result,
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.updateUserUseCase.execute(id, updateUserDto)
    return {
      message: 'Usuário atualizado com sucesso!',
      result,
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiOkResponse({ description: 'Status do usuário atualizado com sucesso' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.statusUserUseCase.execute(id, updateUserDto)
    return {
      message: 'Usuário com status atualizado com sucesso!',
      result,
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiOkResponse({ description: 'Usuário removido com sucesso' })
  async remove(@Param('id') id: string) {
    const result = await this.removeUserUseCase.execute(id)
    return {
      message: 'Usuário removido com sucesso!',
      result,
    }
  }
}
