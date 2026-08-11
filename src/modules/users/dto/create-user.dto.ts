import { ApiProperty } from '@nestjs/swagger'
import type { UserRole } from '../entities/user.entity'

export class CreateUserDto {
  @ApiProperty({ example: 'João Silva' })
  name: string

  @ApiProperty({ example: 'joao@igreja.com' })
  email: string

  @ApiProperty({ example: 'senhaSegura123', minLength: 6 })
  password: string

  @ApiProperty({
    enum: ['admin', 'secretaria', 'tesoureiro', 'visualizador'],
    example: 'admin',
  })
  role: UserRole

  @ApiProperty({ example: true })
  status: boolean
}
