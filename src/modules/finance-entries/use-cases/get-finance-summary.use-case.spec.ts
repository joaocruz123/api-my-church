import { GetFinanceSummaryUseCase } from './get-finance-summary.use-case'

describe('GetFinanceSummaryUseCase', () => {
  const monthQb = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  }
  const accQb = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  }
  const entryRepo = {
    createQueryBuilder: jest
      .fn()
      .mockReturnValueOnce(monthQb)
      .mockReturnValueOnce(accQb),
  }
  const categoryRepo = { find: jest.fn() }

  it('calcula entradas, saídas, saldo e acumulado', async () => {
    monthQb.getMany.mockResolvedValue([
      { type: 'entrada', amount: 100, category_id: 'dizimo' },
      { type: 'saida', amount: 40, category_id: 'luz' },
    ])
    accQb.getMany.mockResolvedValue([
      { type: 'entrada', amount: 100, category_id: 'dizimo' },
      { type: 'entrada', amount: 50, category_id: 'dizimo' },
      { type: 'saida', amount: 40, category_id: 'luz' },
    ])
    categoryRepo.find.mockResolvedValue([
      { id: 'dizimo', name: 'Dízimos' },
      { id: 'luz', name: 'Energia' },
    ])

    const useCase = new GetFinanceSummaryUseCase(
      entryRepo as never,
      categoryRepo as never,
    )
    const result = await useCase.execute(2026, 8)

    expect(result.entradas).toBe(100)
    expect(result.saidas).toBe(40)
    expect(result.saldo).toBe(60)
    expect(result.saldoAcumulado).toBe(110)
    expect(result.byCategory).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ categoryName: 'Dízimos', total: 100 }),
      ]),
    )
  })
})
