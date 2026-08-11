import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import type { AnnouncementPriority } from '../entities/announcement.entity'

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Retiro de Jovens' })
  title: string

  @ApiProperty({ example: 'Inscrições abertas até sexta-feira.' })
  content: string

  @ApiProperty({
    example: '2026-08-09T08:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  published_at: Date

  @ApiPropertyOptional({
    example: '2026-08-20T23:59:59.000Z',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  expires_at?: Date | null

  @ApiProperty({
    enum: ['normal', 'importante', 'urgente'],
    example: 'importante',
  })
  priority: AnnouncementPriority

  @ApiProperty({ example: false })
  pinned: boolean

  @ApiPropertyOptional({
    example: 'https://cdn.exemplo.com/aviso.pdf',
    nullable: true,
  })
  attachment?: string | null

  @ApiPropertyOptional({
    example: 'uuid-do-usuario',
    nullable: true,
  })
  created_by?: string | null

  @ApiProperty({ example: true })
  status: boolean
}
