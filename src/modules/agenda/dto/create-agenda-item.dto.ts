import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import type {
  AgendaItemStatus,
  AgendaItemType,
} from '../entities/agenda-item.entity'

export class CreateAgendaItemDto {
  @ApiProperty({ example: 'Culto de Domingo' })
  title: string

  @ApiPropertyOptional({
    example: 'Culto da manhã com Santa Ceia',
    nullable: true,
  })
  description?: string | null

  @ApiProperty({
    example: '2026-08-10T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  starts_at: Date

  @ApiPropertyOptional({
    example: '2026-08-10T12:00:00.000Z',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  ends_at?: Date | null

  @ApiPropertyOptional({ example: 'Templo Principal', nullable: true })
  location?: string | null

  @ApiProperty({
    enum: ['culto', 'reuniao', 'ensaio', 'evento', 'outro'],
    example: 'culto',
  })
  type: AgendaItemType

  @ApiPropertyOptional({ example: 'Pastor João', nullable: true })
  responsible?: string | null

  @ApiProperty({
    enum: ['agendado', 'cancelado'],
    example: 'agendado',
  })
  item_status: AgendaItemStatus

  @ApiPropertyOptional({
    example: 'uuid-do-usuario',
    nullable: true,
  })
  created_by?: string | null

  @ApiProperty({ example: true })
  status: boolean
}
