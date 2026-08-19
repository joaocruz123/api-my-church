import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { PAGINATE_DEFAULTS } from '../../../common/pagination/paginated-response.util'
import { User } from '../entities/user.entity'

@Injectable()
export class FindAllUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  execute(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepo, {
      sortableColumns: ['id', 'name', 'email', 'role', 'created_at', 'status'],
      defaultSortBy: [['name', 'ASC']],
      searchableColumns: ['name', 'email', 'role'],
      select: ['id', 'name', 'email', 'role', 'status', 'created_at'],
      defaultLimit: PAGINATE_DEFAULTS.defaultLimit,
      maxLimit: PAGINATE_DEFAULTS.maxLimit,
    })
  }
}
