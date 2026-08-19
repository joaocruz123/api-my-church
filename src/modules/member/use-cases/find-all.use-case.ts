import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { PAGINATE_DEFAULTS } from '../../../common/pagination/paginated-response.util'
import { Member } from '../entities/member.entity'

@Injectable()
export class FindAllMemberUseCase {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  execute(query: PaginateQuery): Promise<Paginated<Member>> {
    return paginate(query, this.memberRepo, {
      sortableColumns: [
        'id',
        'name',
        'phone',
        'city',
        'member_status',
        'ministry',
        'created_at',
        'status',
      ],
      defaultSortBy: [['name', 'ASC']],
      searchableColumns: ['name', 'phone', 'email', 'cpf'],
      filterableColumns: {
        member_status: true,
        city: true,
        ministry: true,
        status: true,
      },
      defaultLimit: PAGINATE_DEFAULTS.defaultLimit,
      maxLimit: PAGINATE_DEFAULTS.maxLimit,
    })
  }
}
