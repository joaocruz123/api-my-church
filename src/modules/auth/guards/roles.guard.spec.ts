import { ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RolesGuard } from './roles.guard'

describe('RolesGuard', () => {
  const reflector = { getAllAndOverride: jest.fn() }
  const guard = new RolesGuard(reflector as unknown as Reflector)

  const context = (user?: { role: string }) =>
    ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as never

  it('permite quando não há papéis exigidos', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined)
    expect(guard.canActivate(context({ role: 'visualizador' }))).toBe(true)
  })

  it('bloqueia tesoureiro em rota de escrita de membros', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin', 'secretaria'])
    expect(() =>
      guard.canActivate(context({ role: 'tesoureiro' })),
    ).toThrow(ForbiddenException)
  })

  it('bloqueia visualizador no financeiro', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin', 'tesoureiro'])
    expect(() =>
      guard.canActivate(context({ role: 'visualizador' })),
    ).toThrow(ForbiddenException)
  })

  it('permite tesoureiro no financeiro', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin', 'tesoureiro'])
    expect(guard.canActivate(context({ role: 'tesoureiro' }))).toBe(true)
  })
})
