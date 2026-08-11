import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entities/user.entity'

@Injectable()
export class RemoveUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(id: string) {
    const user = await this.userRepo.findOneOrFail({ where: { id } })
    return this.userRepo.remove(user)
  }
}
