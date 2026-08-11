import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Announcement } from '../entities/announcement.entity'

@Injectable()
export class FindIdAnnouncementUseCase {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,
  ) {}

  execute(id: string) {
    return this.announcementRepo.findOneOrFail({ where: { id } })
  }
}
