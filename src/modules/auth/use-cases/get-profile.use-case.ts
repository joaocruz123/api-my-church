import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Injectable()
export class GetProfileUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'name', 'email', 'role', 'status', 'created_at'],
    })

    if (!user || !user.status) {
      throw new UnauthorizedException('Usuário não encontrado ou inativo.')
    }

    return user
  }
}
