import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import type { FinanceCategoryType } from '../entities/finance-category.entity'

export class CreateFinanceCategoryDto {
  @ApiProperty({ example: 'Dízimos' })
  name: string

  @ApiProperty({
    enum: ['entrada', 'saida'],
    example: 'entrada',
  })
  type: FinanceCategoryType

  @ApiPropertyOptional({
    example: 'Receitas de dízimos dos membros',
    nullable: true,
  })
  description?: string | null

  @ApiProperty({ example: true })
  status: boolean
}
