import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { hashPassword } from '../../../common/utils/password.util'
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

    if (input.name) user.name = input.name
    if (input.email) user.email = input.email
    if (input.role) user.role = input.role
    if (input.password) user.password = await hashPassword(input.password)
    if (input.status !== undefined) user.status = input.status

    const saved = await this.userRepo.save(user)
    const { password: _password, ...safeUser } = saved
    return safeUser
  }
}
