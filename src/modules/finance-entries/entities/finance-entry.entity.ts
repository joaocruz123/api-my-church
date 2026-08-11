import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

export type FinanceEntryType = 'entrada' | 'saida'
export type PaymentMethod =
  | 'dinheiro'
  | 'pix'
  | 'transferencia'
  | 'cartao'
  | 'cheque'
  | 'outro'
export type FinanceEntryStatus = 'ativo' | 'cancelado'

@Entity()
export class FinanceEntry {
  @PrimaryColumn()
  id: string

  @Column({ type: 'varchar' })
  type: FinanceEntryType

  @Column()
  category_id: string

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number

  @Column({ type: 'date' })
  entry_date: Date

  @Column({ type: 'text', nullable: true })
  description?: string | null

  @Column({ type: 'varchar' })
  payment_method: PaymentMethod

  @Column({ type: 'varchar', nullable: true })
  created_by?: string | null

  @Column({ type: 'varchar', nullable: true })
  attachment?: string | null

  @Column({ type: 'varchar', default: 'ativo' })
  entry_status: FinanceEntryStatus

  @Column({ default: true })
  status: boolean

  @CreateDateColumn()
  created_at: Date

  constructor(
    props: {
      type: FinanceEntryType
      category_id: string
      amount: number
      entry_date: Date
      description?: string | null
      payment_method: PaymentMethod
      created_by?: string | null
      attachment?: string | null
      entry_status: FinanceEntryStatus
      status: boolean
    },
    id?: string,
  ) {
    Object.assign(this, props)
    this.id = id ?? uuidv4()
  }
}
