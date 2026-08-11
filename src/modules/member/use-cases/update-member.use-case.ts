import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateMemberDto } from '../dto/update-member.dto'
import { Member } from '../entities/member.entity'

@Injectable()
export class UpdateMemberUseCase {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepo: Repository<Member>,
  ) {}

  async execute(id: string, input: UpdateMemberDto) {
    const member = await this.memberRepo.findOneOrFail({ where: { id } })

    Object.assign(member, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.date_birth !== undefined && { date_birth: input.date_birth }),
      ...(input.gender !== undefined && { gender: input.gender }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.member_status !== undefined && {
        member_status: input.member_status,
      }),
      ...(input.cpf !== undefined && { cpf: input.cpf }),
      ...(input.email !== undefined && { email: input.email }),
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

    return this.memberRepo.save(member)
  }
}
