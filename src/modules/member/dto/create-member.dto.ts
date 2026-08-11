import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import type { MemberStatus } from '../entities/member.entity'

export class CreateMemberDto {
  @ApiProperty({ example: 'Maria Souza' })
  name: string

  @ApiProperty({ example: '1990-05-15', type: String, format: 'date' })
  date_birth: Date

  @ApiProperty({ example: 'feminino' })
  gender: string

  @ApiProperty({ example: '11999999999' })
  phone: string

  @ApiProperty({
    enum: ['ativo', 'inativo', 'visitante', 'transferido', 'falecido'],
    example: 'ativo',
  })
  member_status: MemberStatus

  @ApiPropertyOptional({ example: '12345678901', nullable: true })
  cpf?: string | null

  @ApiPropertyOptional({ example: 'maria@email.com', nullable: true })
  email?: string | null

  @ApiPropertyOptional({ example: '01310100', nullable: true })
  cep?: string | null

  @ApiPropertyOptional({ example: 'Av. Paulista', nullable: true })
  street?: string | null

  @ApiPropertyOptional({ example: '1000', nullable: true })
  number?: string | null

  @ApiPropertyOptional({ example: 'Bela Vista', nullable: true })
  neighborhood?: string | null

  @ApiPropertyOptional({ example: 'São Paulo', nullable: true })
  city?: string | null

  @ApiPropertyOptional({ example: 'SP', nullable: true })
  state?: string | null

  @ApiPropertyOptional({ example: 'casado', nullable: true })
  marital_status?: string | null

  @ApiPropertyOptional({ example: 'Pedro Souza', nullable: true })
  spouse_name?: string | null

  @ApiPropertyOptional({
    example: '2010-01-20',
    type: String,
    format: 'date',
    nullable: true,
  })
  baptism_date?: Date | null

  @ApiPropertyOptional({
    example: '2012-03-10',
    type: String,
    format: 'date',
    nullable: true,
  })
  membership_date?: Date | null

  @ApiPropertyOptional({ example: 'Louvor', nullable: true })
  ministry?: string | null

  @ApiPropertyOptional({ example: 'Ana Souza', nullable: true })
  emergency_contact_name?: string | null

  @ApiPropertyOptional({ example: '11988888888', nullable: true })
  emergency_contact_phone?: string | null

  @ApiPropertyOptional({ example: 'Observações do membro', nullable: true })
  notes?: string | null

  @ApiPropertyOptional({ example: 'https://cdn.exemplo.com/avatar.jpg', nullable: true })
  avatar?: string | null

  @ApiProperty({ example: true })
  status: boolean
}
