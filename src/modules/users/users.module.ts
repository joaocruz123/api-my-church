import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { CreateUserUseCase } from './use-cases/create-user.use-case'
import { FindAllUserUseCase } from './use-cases/find-all.use-case'
import { FindIdUserUseCase } from './use-cases/find-id.use-case'
import { RemoveUserUseCase } from './use-cases/remove-user.use-case'
import { StatusUserUseCase } from './use-cases/status-user.use-case'
import { UpdateUserUseCase } from './use-cases/update-user.use-case'
import { UsersController } from './users.controller'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    FindAllUserUseCase,
    FindIdUserUseCase,
    UpdateUserUseCase,
    StatusUserUseCase,
    RemoveUserUseCase,
  ],
})
export class UsersModule {}
