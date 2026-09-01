import { SelectQueryBuilder } from 'typeorm'
import { Member, MemberStatus } from './entities/member.entity'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const MEMBER_STATUSES: MemberStatus[] = [
  'ativo',
  'inativo',
  'visitante',
  'transferido',
  'falecido',
]

export type MemberListFilters = {
  search?: string
  member_status?: string
  ministry?: string
  date_birth_from?: string
  date_birth_to?: string
  created_at_from?: string
  created_at_to?: string
}

export function escapeLike(value: string) {
  return value.replace(/[%_\\]/g, '')
}

function isMemberStatus(value: string): value is MemberStatus {
  return MEMBER_STATUSES.includes(value as MemberStatus)
}

function formatFilterDate(value: string) {
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

function readDate(value?: string) {
  return DATE_RE.test(value ?? '') ? value : undefined
}

function nextDay(value: string) {
  const date = new Date(`${value}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().slice(0, 10)
}

function describeDateRange(label: string, from?: string, to?: string) {
  if (from && to) return `${label}: ${formatFilterDate(from)} a ${formatFilterDate(to)}`
  if (from) return `${label} a partir de ${formatFilterDate(from)}`
  if (to) return `${label} até ${formatFilterDate(to)}`
  return undefined
}

export function applyMemberSearch(
  qb: SelectQueryBuilder<Member>,
  search?: string,
  alias = 'member',
) {
  const term = escapeLike(search?.trim() ?? '')
  if (!term) return qb

  qb.andWhere(
    `(${alias}.name LIKE :memberSearch OR ${alias}.phone LIKE :memberSearch OR ${alias}.email LIKE :memberSearch OR ${alias}.cpf LIKE :memberSearch)`,
    { memberSearch: `%${term}%` },
  )
  return qb
}

export function applyMemberFilters(
  qb: SelectQueryBuilder<Member>,
  filters: MemberListFilters,
  alias = 'member',
) {
  const status = filters.member_status?.trim()
  if (status && isMemberStatus(status)) {
    qb.andWhere(`${alias}.member_status = :memberStatus`, {
      memberStatus: status,
    })
  }

  const ministry = escapeLike(filters.ministry?.trim() ?? '').toLowerCase()
  if (ministry) {
    qb.andWhere(`LOWER(${alias}.ministry) LIKE :ministry`, {
      ministry: `%${ministry}%`,
    })
  }

  const birthFrom = readDate(filters.date_birth_from)
  const birthTo = readDate(filters.date_birth_to)

  if (birthFrom) {
    qb.andWhere(`${alias}.date_birth >= :dateBirthFrom`, {
      dateBirthFrom: birthFrom,
    })
  }
  if (birthTo) {
    qb.andWhere(`${alias}.date_birth <= :dateBirthTo`, { dateBirthTo: birthTo })
  }

  const createdFrom = readDate(filters.created_at_from)
  const createdTo = readDate(filters.created_at_to)

  if (createdFrom) {
    qb.andWhere(`${alias}.created_at >= :createdAtFrom`, {
      createdAtFrom: `${createdFrom} 00:00:00`,
    })
  }
  if (createdTo) {
    qb.andWhere(`${alias}.created_at < :createdAtTo`, {
      createdAtTo: `${nextDay(createdTo)} 00:00:00`,
    })
  }

  return qb
}

export function describeMemberFilters(filters: MemberListFilters) {
  const parts: string[] = []
  const search = filters.search?.trim()
  if (search) parts.push(`Busca: ${search}`)

  const status = filters.member_status?.trim()
  if (status && isMemberStatus(status)) {
    parts.push(`Status: ${status}`)
  }

  const ministry = filters.ministry?.trim()
  if (ministry) parts.push(`Ministério: ${ministry}`)

  const birthRange = describeDateRange(
    'Nascimento',
    readDate(filters.date_birth_from),
    readDate(filters.date_birth_to),
  )
  if (birthRange) parts.push(birthRange)

  const createdRange = describeDateRange(
    'Cadastro',
    readDate(filters.created_at_from),
    readDate(filters.created_at_to),
  )
  if (createdRange) parts.push(createdRange)

  return parts.length > 0 ? parts.join(' · ') : 'Nenhum filtro aplicado'
}
