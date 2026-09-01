import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { PAGINATE_DEFAULTS } from '../../../common/pagination/paginated-response.util'
import { Member } from '../entities/member.entity'
import {
  applyMemberFilters,
  type MemberListFilters,
} from '../member-filters'

@Injectable()
export class FindAllMemberUseCase {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  execute(
    query: PaginateQuery,
    filters: MemberListFilters = {},
  ): Promise<Paginated<Member>> {
    const qb = this.memberRepo.createQueryBuilder('member')
    applyMemberFilters(qb, filters)

    return paginate(query, qb, {
      sortableColumns: [
        'id',
        'name',
        'phone',
        'city',
        'member_status',
        'ministry',
        'date_birth',
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
