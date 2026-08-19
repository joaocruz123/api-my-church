import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { comparePassword } from '../../../common/utils/password.util'
import { User } from '../../users/entities/user.entity'
import { LoginDto } from '../dto/login.dto'
import type { JwtPayload } from '../types/jwt-payload.type'

@Injectable()
export class LoginUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: input.email },
    })

    if (!user || !user.status) {
      throw new UnauthorizedException('E-mail ou senha inválidos.')
    }

    const passwordMatches = await comparePassword(input.password, user.password)
    if (!passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha inválidos.')
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    const { password: _password, ...safeUser } = user

    return {
      access_token: this.jwtService.sign(payload),
      user: safeUser,
    }
  }
}
