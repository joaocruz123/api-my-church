import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateUserDto } from '../dto/update-user.dto'
import { User } from '../entities/user.entity'

@Injectable()
export class StatusUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(id: string, input: UpdateUserDto) {
    const user = await this.userRepo.findOneOrFail({ where: { id } })
    if (input.status !== undefined) user.status = input.status

    return this.userRepo.save(user)
  }
}
