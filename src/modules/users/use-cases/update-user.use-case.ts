import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateUserDto } from '../dto/update-user.dto'
import { User } from '../entities/user.entity'

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(id: string, input: UpdateUserDto) {
    const user = await this.userRepo.findOneOrFail({ where: { id } })

    input.name && (user.name = input.name)
    input.email && (user.email = input.email)
    input.password && (user.password = input.password)
    input.role && (user.role = input.role)

    return this.userRepo.save(user)
  }
}
