import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'admin@mychurch.local' })
  email: string

  @ApiProperty({ example: 'admin123' })
  password: string
}
