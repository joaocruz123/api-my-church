import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Member } from './entities/member.entity'
import { MembersController } from './members.controller'
import { CreateMemberUseCase } from './use-cases/create-member.use-case'
import { ExportMembersPdfUseCase } from './use-cases/export-members-pdf.use-case'
import { FindAllMemberUseCase } from './use-cases/find-all.use-case'
import { FindBirthdaysMemberUseCase } from './use-cases/find-birthdays.use-case'
import { FindIdMemberUseCase } from './use-cases/find-id.use-case'
import { GetMemberStatsUseCase } from './use-cases/get-member-stats.use-case'
import { RemoveMemberUseCase } from './use-cases/remove-member.use-case'
import { StatusMemberUseCase } from './use-cases/status-member.use-case'
import { UpdateMemberUseCase } from './use-cases/update-member.use-case'
import { MemberUniquenessService } from './services/member-uniqueness.service'

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  controllers: [MembersController],
  providers: [
    CreateMemberUseCase,
    ExportMembersPdfUseCase,
    FindAllMemberUseCase,
    FindBirthdaysMemberUseCase,
    GetMemberStatsUseCase,
    FindIdMemberUseCase,
    UpdateMemberUseCase,
    StatusMemberUseCase,
    RemoveMemberUseCase,
    MemberUniquenessService,
  ],
})
export class MembersModule {}
