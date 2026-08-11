import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Announcement } from '../entities/announcement.entity'

@Injectable()
export class RemoveAnnouncementUseCase {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,
  ) {}

  async execute(id: string) {
    const announcement = await this.announcementRepo.findOneOrFail({
      where: { id },
    })
    return this.announcementRepo.remove(announcement)
  }
}
