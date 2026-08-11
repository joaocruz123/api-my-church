import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateAnnouncementDto } from '../dto/update-announcement.dto'
import { Announcement } from '../entities/announcement.entity'

@Injectable()
export class StatusAnnouncementUseCase {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,
  ) {}

  async execute(id: string, input: UpdateAnnouncementDto) {
    const announcement = await this.announcementRepo.findOneOrFail({
      where: { id },
    })
    if (input.status !== undefined) announcement.status = input.status

    return this.announcementRepo.save(announcement)
  }
}
