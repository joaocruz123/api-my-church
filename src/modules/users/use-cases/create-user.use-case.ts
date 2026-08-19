import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { hashPassword } from '../../../common/utils/password.util'
import { CreateUserDto } from '../dto/create-user.dto'
import { User } from '../entities/user.entity'

@Injectable()
export class CreateUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async execute(input: CreateUserDto) {
    const user = new User({
      ...input,
      password: await hashPassword(input.password),
    })
    const saved = await this.userRepo.save(user)
    const { password: _password, ...safeUser } = saved
    return safeUser
  }
}
