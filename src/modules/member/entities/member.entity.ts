import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

export type MemberStatus =
  | 'ativo'
  | 'inativo'
  | 'visitante'
  | 'transferido'
  | 'falecido'

@Entity()
export class Member {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column({ type: 'date' })
  date_birth: Date

  @Column()
  gender: string

  @Column()
  phone: string

  @Column({ type: 'varchar' })
  member_status: MemberStatus

  @Column({ type: 'varchar', nullable: true, unique: true })
  cpf?: string | null

  @Column({ type: 'varchar', nullable: true, unique: true })
  email?: string | null

  @Column({ type: 'varchar', nullable: true })
  cep?: string | null

  @Column({ type: 'varchar', nullable: true })
  street?: string | null

  @Column({ type: 'varchar', nullable: true })
  number?: string | null

  @Column({ type: 'varchar', nullable: true })
  neighborhood?: string | null

  @Column({ type: 'varchar', nullable: true })
  city?: string | null

  @Column({ type: 'varchar', nullable: true })
  state?: string | null

  @Column({ type: 'varchar', nullable: true })
  marital_status?: string | null

  @Column({ type: 'varchar', nullable: true })
  spouse_name?: string | null

  @Column({ type: 'date', nullable: true })
  baptism_date?: Date | null

  @Column({ type: 'date', nullable: true })
  membership_date?: Date | null

  @Column({ type: 'varchar', nullable: true })
  ministry?: string | null

  @Column({ type: 'varchar', nullable: true })
  emergency_contact_name?: string | null

  @Column({ type: 'varchar', nullable: true })
  emergency_contact_phone?: string | null

  @Column({ type: 'text', nullable: true })
  notes?: string | null

  @Column({ type: 'varchar', nullable: true })
  avatar?: string | null

  @Column({ default: true })
  status: boolean

  @CreateDateColumn()
  created_at: Date

  constructor(
    props: {
      name: string
      date_birth: Date
      gender: string
      phone: string
      member_status: MemberStatus
      cpf?: string | null
      email?: string | null
      cep?: string | null
      street?: string | null
      number?: string | null
      neighborhood?: string | null
      city?: string | null
      state?: string | null
      marital_status?: string | null
      spouse_name?: string | null
      baptism_date?: Date | null
      membership_date?: Date | null
      ministry?: string | null
      emergency_contact_name?: string | null
      emergency_contact_phone?: string | null
      notes?: string | null
      avatar?: string | null
      status: boolean
    },
    id?: string,
  ) {
    Object.assign(this, props)
    this.id = id ?? uuidv4()
  }
}
