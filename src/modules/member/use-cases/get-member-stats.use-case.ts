import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Member } from '../entities/member.entity'

@Injectable()
export class GetMemberStatsUseCase {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  async execute() {
    const [active, visitantes, inativos] = await Promise.all([
      this.memberRepo.count({
        where: { status: true, member_status: 'ativo' },
      }),
      this.memberRepo.count({
        where: { status: true, member_status: 'visitante' },
      }),
      this.memberRepo.count({
        where: { status: true, member_status: 'inativo' },
      }),
    ])

    return { active, visitantes, inativos }
  }
}
