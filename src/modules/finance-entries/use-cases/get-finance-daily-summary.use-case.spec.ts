import { GetFinanceDailySummaryUseCase } from './get-finance-daily-summary.use-case'

describe('GetFinanceDailySummaryUseCase', () => {
  const qb = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  }
  const entryRepo = {
    createQueryBuilder: jest.fn().mockReturnValue(qb),
  }

  it('agrupa entradas e saídas por dia do mês', async () => {
    qb.getMany.mockResolvedValue([
      { type: 'entrada', amount: 100, entry_date: '2026-08-01' },
      { type: 'entrada', amount: 40, entry_date: '2026-08-01' },
      { type: 'saida', amount: 25, entry_date: '2026-08-15' },
    ])

    const useCase = new GetFinanceDailySummaryUseCase(entryRepo as never)
    const result = await useCase.execute(2026, 8)

    expect(result.year).toBe(2026)
    expect(result.month).toBe(8)
    expect(result.days).toHaveLength(31)
    expect(result.days[0]).toEqual({
      day: 1,
      entradas: 140,
      saidas: 0,
      saldo: 140,
    })
    expect(result.days[14]).toEqual({
      day: 15,
      entradas: 0,
      saidas: 25,
      saldo: -25,
    })
    expect(result.totals).toEqual({
      entradas: 140,
      saidas: 25,
      saldo: 115,
    })
  })

  it('ignora lançamentos com dia inválido', async () => {
    qb.getMany.mockResolvedValue([
      { type: 'entrada', amount: 10, entry_date: 'invalid' },
    ])

    const useCase = new GetFinanceDailySummaryUseCase(entryRepo as never)
    const result = await useCase.execute(2026, 2)

    expect(result.days).toHaveLength(28)
    expect(result.totals).toEqual({ entradas: 0, saidas: 0, saldo: 0 })
  })
})
