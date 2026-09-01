import { GetFinanceYearlySummaryUseCase } from './get-finance-yearly-summary.use-case'

describe('GetFinanceYearlySummaryUseCase', () => {
  const qb = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  }
  const entryRepo = {
    createQueryBuilder: jest.fn().mockReturnValue(qb),
  }

  it('agrupa entradas e saídas por mês e calcula totais do ano', async () => {
    qb.getMany.mockResolvedValue([
      { type: 'entrada', amount: 100, entry_date: '2026-01-10' },
      { type: 'entrada', amount: 50, entry_date: '2026-01-20' },
      { type: 'saida', amount: 30, entry_date: '2026-03-05' },
      { type: 'saida', amount: 20, entry_date: '2026-12-01' },
    ])

    const useCase = new GetFinanceYearlySummaryUseCase(entryRepo as never)
    const result = await useCase.execute(2026)

    expect(result.year).toBe(2026)
    expect(result.months).toHaveLength(12)
    expect(result.months[0]).toEqual({
      month: 1,
      entradas: 150,
      saidas: 0,
      saldo: 150,
    })
    expect(result.months[2]).toEqual({
      month: 3,
      entradas: 0,
      saidas: 30,
      saldo: -30,
    })
    expect(result.months[11]).toEqual({
      month: 12,
      entradas: 0,
      saidas: 20,
      saldo: -20,
    })
    expect(result.totals).toEqual({
      entradas: 150,
      saidas: 50,
      saldo: 100,
    })
  })

  it('ignora lançamentos com mês inválido', async () => {
    qb.getMany.mockResolvedValue([
      { type: 'entrada', amount: 10, entry_date: 'invalid' },
    ])

    const useCase = new GetFinanceYearlySummaryUseCase(entryRepo as never)
    const result = await useCase.execute(2026)

    expect(result.totals).toEqual({ entradas: 0, saidas: 0, saldo: 0 })
  })
})
