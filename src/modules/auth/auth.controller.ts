import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ResponseInterceptor } from '../../response.interceptor'
import { CurrentUser } from './decorators/current-user.decorator'
import { Public } from './decorators/public.decorator'
import { LoginDto } from './dto/login.dto'
import type { AuthenticatedUser } from './types/jwt-payload.type'
import { GetProfileUseCase } from './use-cases/get-profile.use-case'
import { LoginUseCase } from './use-cases/login.use-case'

@ApiTags('Auth')
@UseInterceptors(ResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login com e-mail e senha' })
  @ApiOkResponse({ description: 'Retorna o token JWT e os dados do usuário' })
  @ApiUnauthorizedResponse({ description: 'E-mail ou senha inválidos' })
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto)
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiOkResponse({ description: 'Perfil recuperado com sucesso' })
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.getProfileUseCase.execute(user.id)
  }
}
