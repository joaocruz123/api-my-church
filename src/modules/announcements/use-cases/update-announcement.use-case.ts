import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateAnnouncementDto } from '../dto/update-announcement.dto'
import { Announcement } from '../entities/announcement.entity'

@Injectable()
export class UpdateAnnouncementUseCase {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,
  ) {}

  async execute(id: string, input: UpdateAnnouncementDto) {
    const announcement = await this.announcementRepo.findOneOrFail({
      where: { id },
    })

    input.title && (announcement.title = input.title)
    input.content && (announcement.content = input.content)
    input.published_at && (announcement.published_at = input.published_at)
    input.expires_at !== undefined && (announcement.expires_at = input.expires_at)
    input.priority && (announcement.priority = input.priority)
    input.pinned !== undefined && (announcement.pinned = input.pinned)
    input.attachment !== undefined && (announcement.attachment = input.attachment)

    return this.announcementRepo.save(announcement)
  }
}
