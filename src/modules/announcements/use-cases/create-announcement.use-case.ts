import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateAnnouncementDto } from '../dto/create-announcement.dto'
import { Announcement } from '../entities/announcement.entity'

@Injectable()
export class CreateAnnouncementUseCase {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,
  ) {}

  execute(input: CreateAnnouncementDto) {
    const announcement = new Announcement(input)
    return this.announcementRepo.save(announcement)
  }
}
