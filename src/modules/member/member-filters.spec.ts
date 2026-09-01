import {
  applyMemberFilters,
  applyMemberSearch,
  describeMemberFilters,
} from './member-filters'

function createQb() {
  return {
    andWhere: jest.fn().mockReturnThis(),
  }
}

describe('member-filters', () => {
  it('aplica busca textual em nome, telefone, e-mail e CPF', () => {
    const qb = createQb()
    applyMemberSearch(qb as never, '  Ana  ')

    expect(qb.andWhere).toHaveBeenCalledWith(
      expect.stringContaining('member.name LIKE :memberSearch'),
      { memberSearch: '%Ana%' },
    )
  })

  it('filtra por status, ministério aproximado, nascimento e período de cadastro', () => {
    const qb = createQb()
    applyMemberFilters(qb as never, {
      member_status: 'ativo',
      ministry: 'Louvor',
      date_birth_from: '1990-01-01',
      date_birth_to: '2000-12-31',
      created_at_from: '2026-01-01',
      created_at_to: '2026-01-31',
    })

    expect(qb.andWhere).toHaveBeenCalledWith(
      'member.member_status = :memberStatus',
      { memberStatus: 'ativo' },
    )
    expect(qb.andWhere).toHaveBeenCalledWith(
      'LOWER(member.ministry) LIKE :ministry',
      { ministry: '%louvor%' },
    )
    expect(qb.andWhere).toHaveBeenCalledWith(
      'member.date_birth >= :dateBirthFrom',
      { dateBirthFrom: '1990-01-01' },
    )
    expect(qb.andWhere).toHaveBeenCalledWith(
      'member.date_birth <= :dateBirthTo',
      { dateBirthTo: '2000-12-31' },
    )
    expect(qb.andWhere).toHaveBeenCalledWith(
      'member.created_at >= :createdAtFrom',
      { createdAtFrom: '2026-01-01 00:00:00' },
    )
    expect(qb.andWhere).toHaveBeenCalledWith(
      'member.created_at < :createdAtTo',
      { createdAtTo: '2026-02-01 00:00:00' },
    )
  })

  it('ignora status e datas inválidos', () => {
    const qb = createQb()
    applyMemberFilters(qb as never, {
      member_status: 'desconhecido',
      date_birth_from: '01-01-1990',
      date_birth_to: 'not-a-date',
      created_at_from: '31/01/2026',
      created_at_to: 'invalid',
    })

    expect(qb.andWhere).not.toHaveBeenCalled()
  })

  it('descreve os filtros aplicados', () => {
    expect(
      describeMemberFilters({
        search: 'Maria',
        member_status: 'ativo',
        ministry: 'Kids',
        date_birth_from: '1980-01-01',
        date_birth_to: '1990-12-31',
      }),
    ).toContain('Status: ativo')
    expect(
      describeMemberFilters({
        date_birth_from: '1980-01-01',
        date_birth_to: '1990-12-31',
      }),
    ).toContain('Nascimento: 01/01/1980 a 31/12/1990')
    expect(
      describeMemberFilters({
        created_at_from: '2026-01-01',
        created_at_to: '2026-01-31',
      }),
    ).toContain('Cadastro: 01/01/2026 a 31/01/2026')
    expect(describeMemberFilters({})).toBe('Nenhum filtro aplicado')
  })
})
