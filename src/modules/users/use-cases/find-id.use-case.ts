import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'

@Injectable()
export class FindIdUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  execute(id: string) {
    return this.userRepo.findOneOrFail({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'status', 'created_at'],
    })
  }
}
