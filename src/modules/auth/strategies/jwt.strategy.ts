import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import type { AuthenticatedUser, JwtPayload } from '../types/jwt-payload.type'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('ACCESS_SECRET_JWT') ??
        'default-secret-change-in-production',
    })
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.userRepo.findOne({ where: { id: payload.sub } })

    if (!user || !user.status) {
      throw new UnauthorizedException('Token inválido ou usuário inativo.')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }
}
