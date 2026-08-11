import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

export type FinanceCategoryType = 'entrada' | 'saida'

@Entity()
export class FinanceCategory {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column({ type: 'varchar' })
  type: FinanceCategoryType

  @Column({ type: 'text', nullable: true })
  description?: string | null

  @Column({ default: true })
  status: boolean

  @CreateDateColumn()
  created_at: Date

  constructor(
    props: {
      name: string
      type: FinanceCategoryType
      description?: string | null
      status: boolean
    },
    id?: string,
  ) {
    Object.assign(this, props)
    this.id = id ?? uuidv4()
  }
}
