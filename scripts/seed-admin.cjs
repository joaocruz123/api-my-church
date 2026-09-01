/**
 * Cria o usuário administrador inicial para desenvolvimento.
 * Uso: npm run seed:admin
 *
 * Lê ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD do .env (veja .env.example).
 * Não sobrescreve se já existir usuário com o mesmo e-mail.
 */
const { randomUUID } = require('crypto')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const mysql = require('mysql2/promise')

const SALT_ROUNDS = 10

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!(key in process.env)) process.env[key] = value
  }
}

async function main() {
  loadEnv()

  const name = process.env.ADMIN_NAME || 'Administrador'
  const email = process.env.ADMIN_EMAIL || 'admin@mychurch.local'
  const password = process.env.ADMIN_PASSWORD || 'admin123'

  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_DATABASE || 'mychurch_db',
  })

  const [existing] = await connection.query(
    'SELECT id, email FROM `user` WHERE email = ? LIMIT 1',
    [email],
  )

  if (existing.length > 0) {
    console.log(`Admin já existe (${email}) — nada a fazer.`)
    await connection.end()
    return
  }

  const id = randomUUID()
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  await connection.query(
    `INSERT INTO \`user\` (id, name, email, password, role, status, created_at)
     VALUES (?, ?, ?, ?, 'admin', 1, NOW(6))`,
    [id, name, email, passwordHash],
  )

  await connection.end()

  console.log('Usuário admin criado com sucesso.')
  console.log(`  Nome:  ${name}`)
  console.log(`  E-mail: ${email}`)
  console.log(`  Senha:  ${password}`)
  console.log('')
  console.log('Use essas credenciais em http://localhost:3001/login')
}

main().catch((error) => {
  console.error('Falha ao criar admin:', error.message)
  process.exit(1)
})
