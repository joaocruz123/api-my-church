export function requireJwtSecret(
  secret: string | undefined,
  envName = 'ACCESS_SECRET_JWT',
): string {
  const value = secret?.trim()
  if (!value || value === 'default-secret-change-in-production') {
    throw new Error(
      `${envName} é obrigatório. Defina um segredo forte no .env (ex.: openssl rand -base64 32).`,
    )
  }
  return value
}
