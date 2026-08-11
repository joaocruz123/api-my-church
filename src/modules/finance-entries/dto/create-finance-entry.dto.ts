import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import type {
  FinanceEntryStatus,
  FinanceEntryType,
  PaymentMethod,
} from '../entities/finance-entry.entity'

export class CreateFinanceEntryDto {
  @ApiProperty({
    enum: ['entrada', 'saida'],
    example: 'entrada',
  })
  type: FinanceEntryType

  @ApiProperty({ example: 'uuid-da-categoria' })
  category_id: string

  @ApiProperty({ example: 150.5 })
  amount: number

  @ApiProperty({ example: '2026-08-09', type: String, format: 'date' })
  entry_date: Date

  @ApiPropertyOptional({
    example: 'Dízimo do mês',
    nullable: true,
  })
  description?: string | null

  @ApiProperty({
    enum: ['dinheiro', 'pix', 'transferencia', 'cartao', 'cheque', 'outro'],
    example: 'pix',
  })
  payment_method: PaymentMethod

  @ApiPropertyOptional({
    example: 'uuid-do-usuario',
    nullable: true,
  })
  created_by?: string | null

  @ApiPropertyOptional({
    example: 'https://cdn.exemplo.com/comprovante.pdf',
    nullable: true,
  })
  attachment?: string | null

  @ApiProperty({
    enum: ['ativo', 'cancelado'],
    example: 'ativo',
  })
  entry_status: FinanceEntryStatus

  @ApiProperty({ example: true })
  status: boolean
}
