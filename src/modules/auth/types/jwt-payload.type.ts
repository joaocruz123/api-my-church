import type { UserRole } from '../../users/entities/user.entity'

export type JwtPayload = {
  sub: string
  email: string
  role: UserRole
}

export type AuthenticatedUser = {
  id: string
  name: string
  email: string
  role: UserRole
}
