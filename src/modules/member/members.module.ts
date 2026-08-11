import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Member } from './entities/member.entity'
import { MembersController } from './members.controller'
import { CreateMemberUseCase } from './use-cases/create-member.use-case'
import { FindAllMemberUseCase } from './use-cases/find-all.use-case'
import { FindIdMemberUseCase } from './use-cases/find-id.use-case'
import { RemoveMemberUseCase } from './use-cases/remove-member.use-case'
import { StatusMemberUseCase } from './use-cases/status-member.use-case'
import { UpdateMemberUseCase } from './use-cases/update-member.use-case'

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MembersController],
  providers: [
    CreateMemberUseCase,
    FindAllMemberUseCase,
    FindIdMemberUseCase,
    UpdateMemberUseCase,
    StatusMemberUseCase,
    RemoveMemberUseCase,
  ],
})
export class MembersModule {}
