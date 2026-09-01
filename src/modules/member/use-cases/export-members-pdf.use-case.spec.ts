import { ExportMembersPdfUseCase } from './export-members-pdf.use-case'

describe('ExportMembersPdfUseCase', () => {
  it('gera um PDF com os membros filtrados', async () => {
    const qb = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([
        {
          id: '1',
          name: 'Maria Souza',
          phone: '11999999999',
          member_status: 'ativo',
          ministry: 'Louvor',
          date_birth: '1990-05-15',
          city: 'São Paulo',
          email: 'maria@email.com',
        },
      ]),
    }
    const memberRepo = {
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    }

    const useCase = new ExportMembersPdfUseCase(memberRepo as never)
    const buffer = await useCase.execute({
      member_status: 'ativo',
      ministry: 'louv',
    })

    expect(buffer.subarray(0, 4).toString()).toBe('%PDF')
    expect(buffer.toString('latin1')).toMatch(/\/Count\s+1\b/)
    expect(qb.orderBy).toHaveBeenCalledWith('member.name', 'ASC')
    expect(memberRepo.createQueryBuilder).toHaveBeenCalledWith('member')
  })
})
