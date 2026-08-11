import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AnnouncementsController } from './announcements.controller'
import { Announcement } from './entities/announcement.entity'
import { CreateAnnouncementUseCase } from './use-cases/create-announcement.use-case'
import { FindAllAnnouncementUseCase } from './use-cases/find-all.use-case'
import { FindIdAnnouncementUseCase } from './use-cases/find-id.use-case'
import { RemoveAnnouncementUseCase } from './use-cases/remove-announcement.use-case'
import { StatusAnnouncementUseCase } from './use-cases/status-announcement.use-case'
import { UpdateAnnouncementUseCase } from './use-cases/update-announcement.use-case'

@Module({
  imports: [TypeOrmModule.forFeature([Announcement])],
  controllers: [AnnouncementsController],
  providers: [
    CreateAnnouncementUseCase,
    FindAllAnnouncementUseCase,
    FindIdAnnouncementUseCase,
    UpdateAnnouncementUseCase,
    StatusAnnouncementUseCase,
    RemoveAnnouncementUseCase,
  ],
})
export class AnnouncementsModule {}
