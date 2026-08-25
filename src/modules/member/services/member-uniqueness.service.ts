import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Member } from '../entities/member.entity'

export function normalizeOptionalCpf(value?: string | null): string | null {
  const digits = value?.replace(/\D/g, '').trim() ?? ''
  return digits.length ? digits : null
}

export function normalizeOptionalEmail(value?: string | null): string | null {
  const email = value?.trim().toLowerCase() ?? ''
  return email.length ? email : null
}

@Injectable()
export class MemberUniquenessService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  async assertUnique(input: {
    cpf?: string | null
    email?: string | null
    excludeId?: string
  }) {
    const cpf = normalizeOptionalCpf(input.cpf)
    const email = normalizeOptionalEmail(input.email)

    if (cpf) {
      const query = this.memberRepo
        .createQueryBuilder('member')
        .where('member.cpf = :cpf', { cpf })
      if (input.excludeId) {
        query.andWhere('member.id != :id', { id: input.excludeId })
      }
      const existing = await query.getOne()
      if (existing) {
        throw new ConflictException('Já existe um membro com este CPF.')
      }
    }

    if (email) {
      const query = this.memberRepo
        .createQueryBuilder('member')
        .where('LOWER(member.email) = :email', { email })
      if (input.excludeId) {
        query.andWhere('member.id != :id', { id: input.excludeId })
      }
      const existing = await query.getOne()
      if (existing) {
        throw new ConflictException('Já existe um membro com este e-mail.')
      }
    }

    return { cpf, email }
  }
}
