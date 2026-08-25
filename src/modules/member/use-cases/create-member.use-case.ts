import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateMemberDto } from '../dto/create-member.dto'
import { Member } from '../entities/member.entity'
import { MemberUniquenessService } from '../services/member-uniqueness.service'

@Injectable()
export class CreateMemberUseCase {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
    private readonly uniqueness: MemberUniquenessService,
  ) {}

  async execute(input: CreateMemberDto) {
    const { cpf, email } = await this.uniqueness.assertUnique({
      cpf: input.cpf,
      email: input.email,
    })

    const member = new Member({
      ...input,
      cpf,
      email,
    })

    try {
      return await this.memberRepo.save(member)
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      if (message.includes('Duplicate') || message.includes('UNIQUE')) {
        throw new ConflictException(
          'Já existe um membro com este CPF ou e-mail.',
        )
      }
      throw error
    }
  }
}
