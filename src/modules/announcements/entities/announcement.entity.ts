import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

export type AnnouncementPriority = 'normal' | 'importante' | 'urgente'

@Entity()
export class Announcement {
  @PrimaryColumn()
  id: string

  @Column()
  title: string

  @Column({ type: 'text' })
  content: string

  @Column({ type: 'datetime' })
  published_at: Date

  @Column({ type: 'datetime', nullable: true })
  expires_at?: Date | null

  @Column({ type: 'varchar', default: 'normal' })
  priority: AnnouncementPriority

  @Column({ default: false })
  pinned: boolean

  @Column({ type: 'varchar', nullable: true })
  attachment?: string | null

  @Column({ type: 'varchar', nullable: true })
  created_by?: string | null

  @Column({ default: true })
  status: boolean

  @CreateDateColumn()
  created_at: Date

  constructor(
    props: {
      title: string
      content: string
      published_at: Date
      expires_at?: Date | null
      priority: AnnouncementPriority
      pinned: boolean
      attachment?: string | null
      created_by?: string | null
      status: boolean
    },
    id?: string,
  ) {
    Object.assign(this, props)
    this.id = id ?? uuidv4()
  }
}
