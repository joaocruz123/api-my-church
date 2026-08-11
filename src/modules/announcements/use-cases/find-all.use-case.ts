import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { Announcement } from '../entities/announcement.entity'

@Injectable()
export class FindAllAnnouncementUseCase {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,
  ) {}

  execute(query: PaginateQuery): Promise<Paginated<Announcement>> {
    return paginate(query, this.announcementRepo, {
      sortableColumns: [
        'id',
        'title',
        'priority',
        'published_at',
        'pinned',
        'created_at',
        'status',
      ],
      defaultSortBy: [
        ['pinned', 'DESC'],
        ['priority', 'DESC'],
        ['published_at', 'DESC'],
      ],
      searchableColumns: ['title', 'content'],
      filterableColumns: {
        priority: true,
        pinned: true,
        status: true,
      },
      select: [
        'id',
        'title',
        'content',
        'published_at',
        'expires_at',
        'priority',
        'pinned',
        'attachment',
        'created_by',
        'status',
        'created_at',
      ],
    })
  }
}
