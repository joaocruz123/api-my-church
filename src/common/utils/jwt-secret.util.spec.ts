import { requireJwtSecret } from './jwt-secret.util'

describe('requireJwtSecret', () => {
  it('retorna o segredo quando definido', () => {
    expect(requireJwtSecret('segredo-forte', 'ACCESS_SECRET_JWT')).toBe(
      'segredo-forte',
    )
  })

  it('falha sem segredo', () => {
    expect(() => requireJwtSecret(undefined, 'ACCESS_SECRET_JWT')).toThrow(
      /ACCESS_SECRET_JWT é obrigatório/,
    )
  })
})
