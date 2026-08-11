import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

export type AgendaItemType =
  | 'culto'
  | 'reuniao'
  | 'ensaio'
  | 'evento'
  | 'outro'

export type AgendaItemStatus = 'agendado' | 'cancelado'

@Entity()
export class AgendaItem {
  @PrimaryColumn()
  id: string

  @Column()
  title: string

  @Column({ type: 'text', nullable: true })
  description?: string | null

  @Column({ type: 'datetime' })
  starts_at: Date

  @Column({ type: 'datetime', nullable: true })
  ends_at?: Date | null

  @Column({ type: 'varchar', nullable: true })
  location?: string | null

  @Column({ type: 'varchar' })
  type: AgendaItemType

  @Column({ type: 'varchar', nullable: true })
  responsible?: string | null

  @Column({ type: 'varchar', default: 'agendado' })
  item_status: AgendaItemStatus

  @Column({ type: 'varchar', nullable: true })
  created_by?: string | null

  @Column({ default: true })
  status: boolean

  @CreateDateColumn()
  created_at: Date

  constructor(
    props: {
      title: string
      description?: string | null
      starts_at: Date
      ends_at?: Date | null
      location?: string | null
      type: AgendaItemType
      responsible?: string | null
      item_status: AgendaItemStatus
      created_by?: string | null
      status: boolean
    },
    id?: string,
  ) {
    Object.assign(this, props)
    this.id = id ?? uuidv4()
  }
}
