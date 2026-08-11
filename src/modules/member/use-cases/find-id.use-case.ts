import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Member } from '../entities/member.entity'

@Injectable()
export class FindIdMemberUseCase {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  execute(id: string) {
    return this.memberRepo.findOneOrFail({ where: { id } })
  }
}
