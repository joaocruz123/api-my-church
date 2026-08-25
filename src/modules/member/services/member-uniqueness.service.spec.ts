import { ConflictException } from '@nestjs/common'
import { MemberUniquenessService } from '../services/member-uniqueness.service'

describe('MemberUniquenessService', () => {
  const qb = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  }
  const memberRepo = {
    createQueryBuilder: jest.fn(() => qb),
  }
  let service: MemberUniquenessService

  beforeEach(() => {
    jest.clearAllMocks()
    qb.where.mockReturnThis()
    qb.andWhere.mockReturnThis()
    service = new MemberUniquenessService(memberRepo as never)
  })

  it('normaliza CPF vazio para null e não consulta o banco', async () => {
    await expect(
      service.assertUnique({ cpf: '  ', email: null }),
    ).resolves.toEqual({ cpf: null, email: null })
    expect(memberRepo.createQueryBuilder).not.toHaveBeenCalled()
  })

  it('bloqueia CPF duplicado', async () => {
    qb.getOne.mockResolvedValue({ id: 'other' })
    await expect(
      service.assertUnique({ cpf: '123.456.789-01' }),
    ).rejects.toBeInstanceOf(ConflictException)
  })

  it('ignora o próprio registro na edição', async () => {
    qb.getOne.mockResolvedValue(null)
    await expect(
      service.assertUnique({
        email: 'maria@email.com',
        excludeId: 'same-id',
      }),
    ).resolves.toEqual({ cpf: null, email: 'maria@email.com' })
    expect(qb.andWhere).toHaveBeenCalled()
  })
})
