import type { UserRole } from '../users/entities/user.entity'

export const MEMBER_READ_ROLES: UserRole[] = [
  'admin',
  'secretaria',
  'tesoureiro',
  'visualizador',
]
export const MEMBER_WRITE_ROLES: UserRole[] = ['admin', 'secretaria']
export const MEMBER_DELETE_ROLES: UserRole[] = ['admin']

export const FINANCE_READ_ROLES: UserRole[] = ['admin', 'tesoureiro']
export const FINANCE_WRITE_ROLES: UserRole[] = ['admin', 'tesoureiro']

export const MURAL_READ_ROLES: UserRole[] = [
  'admin',
  'secretaria',
  'tesoureiro',
  'visualizador',
]
export const MURAL_WRITE_ROLES: UserRole[] = ['admin', 'secretaria']

export const USER_ADMIN_ROLES: UserRole[] = ['admin']
