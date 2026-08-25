import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateMemberDto } from '../dto/update-member.dto'
import { Member } from '../entities/member.entity'
import { MemberUniquenessService } from '../services/member-uniqueness.service'

@Injectable()
export class UpdateMemberUseCase {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
    private readonly uniqueness: MemberUniquenessService,
  ) {}

  async execute(id: string, input: UpdateMemberDto) {
    const member = await this.memberRepo.findOneOrFail({ where: { id } })

    if (input.cpf !== undefined || input.email !== undefined) {
      const { cpf, email } = await this.uniqueness.assertUnique({
        cpf: input.cpf !== undefined ? input.cpf : member.cpf,
        email: input.email !== undefined ? input.email : member.email,
        excludeId: id,
      })
      if (input.cpf !== undefined) member.cpf = cpf
      if (input.email !== undefined) member.email = email
    }

    Object.assign(member, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.date_birth !== undefined && { date_birth: input.date_birth }),
      ...(input.gender !== undefined && { gender: input.gender }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.member_status !== undefined && {
        member_status: input.member_status,
      }),
      ...(input.cep !== undefined && { cep: input.cep }),
      ...(input.street !== undefined && { street: input.street }),
      ...(input.number !== undefined && { number: input.number }),
      ...(input.neighborhood !== undefined && {
        neighborhood: input.neighborhood,
      }),
      ...(input.city !== undefined && { city: input.city }),
      ...(input.state !== undefined && { state: input.state }),
      ...(input.marital_status !== undefined && {
        marital_status: input.marital_status,
      }),
      ...(input.spouse_name !== undefined && { spouse_name: input.spouse_name }),
      ...(input.baptism_date !== undefined && {
        baptism_date: input.baptism_date,
      }),
      ...(input.membership_date !== undefined && {
        membership_date: input.membership_date,
      }),
      ...(input.ministry !== undefined && { ministry: input.ministry }),
      ...(input.emergency_contact_name !== undefined && {
        emergency_contact_name: input.emergency_contact_name,
      }),
      ...(input.emergency_contact_phone !== undefined && {
        emergency_contact_phone: input.emergency_contact_phone,
      }),
      ...(input.notes !== undefined && { notes: input.notes }),
      ...(input.avatar !== undefined && { avatar: input.avatar }),
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
