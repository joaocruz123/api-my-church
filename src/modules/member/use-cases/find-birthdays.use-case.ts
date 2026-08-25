import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Member } from '../entities/member.entity'

@Injectable()
export class FindBirthdaysMemberUseCase {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  execute(month?: number) {
    const targetMonth = this.resolveMonth(month)

    return this.memberRepo
      .createQueryBuilder('member')
      .where('MONTH(member.date_birth) = :month', { month: targetMonth })
      .andWhere('member.status = :status', { status: true })
      .andWhere('member.member_status != :deceased', { deceased: 'falecido' })
      .orderBy('DAY(member.date_birth)', 'ASC')
      .addOrderBy('member.name', 'ASC')
      .getMany()
  }

  private resolveMonth(month?: number) {
    if (month && month >= 1 && month <= 12) return month
    return new Date().getMonth() + 1
  }
}
