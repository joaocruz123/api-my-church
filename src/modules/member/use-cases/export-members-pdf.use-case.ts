import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Member } from '../entities/member.entity'
import {
  applyMemberFilters,
  applyMemberSearch,
  type MemberListFilters,
} from '../member-filters'
import { buildMembersPdf } from '../members-pdf.builder'

@Injectable()
export class ExportMembersPdfUseCase {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  async execute(filters: MemberListFilters) {
    const qb = this.memberRepo.createQueryBuilder('member')
    applyMemberSearch(qb, filters.search)
    applyMemberFilters(qb, filters)
    qb.orderBy('member.name', 'ASC')

    const members = await qb.getMany()
    return buildMembersPdf(members, filters)
  }
}
