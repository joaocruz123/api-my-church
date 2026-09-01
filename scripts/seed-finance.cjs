/**
 * Gera massa de categorias e lançamentos financeiros para desenvolvimento.
 * Uso: npm run seed:finance
 *
 * Não sobrescreve registros existentes (categoria por nome; lançamento por
 * data + valor + descrição + categoria).
 *
 * Cobre jan–ago/2026: dízimos e ofertas de domingo, contas mensais,
 * ajuda social, eventos e alguns lançamentos cancelados.
 */
const { randomUUID } = require('crypto')
const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')

const TODAY = '2026-08-27'

const CATEGORIES = [
  {
    name: 'Dízimos',
    type: 'entrada',
    description: 'Receitas de dízimos dos membros',
  },
  {
    name: 'Ofertas',
    type: 'entrada',
    description: 'Ofertas dos cultos e reuniões',
  },
  {
    name: 'Doações',
    type: 'entrada',
    description: 'Doações pontuais de pessoas e empresas',
  },
  {
    name: 'Eventos',
    type: 'entrada',
    description: 'Receitas de conferências, bazares e eventos',
  },
  {
    name: 'Outras receitas',
    type: 'entrada',
    description: 'Receitas avulsas não classificadas',
  },
  {
    name: 'Aluguel',
    type: 'saida',
    description: 'Aluguel do templo e espaços',
  },
  {
    name: 'Energia',
    type: 'saida',
    description: 'Conta de energia elétrica',
  },
  {
    name: 'Água',
    type: 'saida',
    description: 'Conta de água e esgoto',
  },
  {
    name: 'Internet',
    type: 'saida',
    description: 'Internet e telefonia',
  },
  {
    name: 'Manutenção',
    type: 'saida',
    description: 'Reparos, limpeza e conservação do templo',
  },
  {
    name: 'Material de culto',
    type: 'saida',
    description: 'Santa ceia, louvor e materiais de reunião',
  },
  {
    name: 'Ajuda social',
    type: 'saida',
    description: 'Cestas básicas, auxílios e ações sociais',
  },
  {
    name: 'Salários/ajuda de custo',
    type: 'saida',
    description: 'Ajuda de custo pastoral e equipe',
  },
  {
    name: 'Outras despesas',
    type: 'saida',
    description: 'Despesas avulsas não classificadas',
  },
]

const TITHES = [
  { who: 'João Pedro Almeida', amount: 450 },
  { who: 'Ana Clara Ferreira', amount: 180 },
  { who: 'Carlos Eduardo Lima', amount: 320 },
  { who: 'Fernanda Costa Oliveira', amount: 250 },
  { who: 'Rafael Santos Pereira', amount: 150 },
  { who: 'Juliana Rocha Martins', amount: 280 },
  { who: 'Bruno Henrique Silva', amount: 500 },
  { who: 'Patrícia Alves Nunes', amount: 200 },
  { who: 'Lucas Gabriel Mendes', amount: 120 },
  { who: 'Camila Dias Barbosa', amount: 220 },
  { who: 'Thiago Moreira Pinto', amount: 350 },
  { who: 'Beatriz Carvalho Gomes', amount: 190 },
  { who: 'Felipe Augusto Ribeiro', amount: 160 },
  { who: 'André Luiz Cardoso', amount: 600 },
  { who: 'Gabriela Souza Pinto', amount: 210 },
  { who: 'Marcelo Vieira Castro', amount: 400 },
  { who: 'Eduardo Ramos Farias', amount: 550 },
  { who: 'Sueli Aparecida Ramos', amount: 140 },
]

const METHODS = ['pix', 'pix', 'pix', 'pix', 'dinheiro', 'transferencia']

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

function pad(n) {
  return String(n).padStart(2, '0')
}

function ymd(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`
}

function isOnOrBefore(date, limit) {
  return date <= limit
}

function sundaysInMonth(year, month) {
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const dates = []
  for (let day = 1; day <= last; day += 1) {
    const dow = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
    if (dow === 0) dates.push(ymd(year, month, day))
  }
  return dates
}

function pickMethod(index) {
  return METHODS[index % METHODS.length]
}

function money(value) {
  return Number(value.toFixed(2))
}

function monthName(month) {
  return [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ][month - 1]
}

async function resolveTable(connection, candidates) {
  const [rows] = await connection.query('SHOW TABLES')
  const names = rows.map((row) => Object.values(row)[0])
  const byLower = new Map(names.map((name) => [String(name).toLowerCase(), name]))
  for (const candidate of candidates) {
    const found = byLower.get(candidate.toLowerCase())
    if (found) return found
  }
  throw new Error(
    `Tabela não encontrada (${candidates.join(', ')}). Tabelas: ${names.join(', ') || 'nenhuma'}`,
  )
}

function buildEntries(categoryIdByName) {
  const entries = []
  const push = (item) => {
    if (!isOnOrBefore(item.entry_date, TODAY)) return
    entries.push({
      id: randomUUID(),
      attachment: null,
      status: 1,
      ...item,
    })
  }

  for (let month = 1; month <= 8; month += 1) {
    const year = 2026
    const label = monthName(month)
    const growth = 1 + (month - 1) * 0.03
    const sundays = sundaysInMonth(year, month)

    sundays.forEach((date, sundayIndex) => {
      const offering = money((1850 + month * 90 + sundayIndex * 120) * growth)
      push({
        type: 'entrada',
        category_id: categoryIdByName.get('Ofertas'),
        amount: offering,
        entry_date: date,
        description: `Oferta do culto de domingo — ${label}`,
        payment_method: sundayIndex % 3 === 0 ? 'dinheiro' : 'pix',
        entry_status: 'ativo',
      })

      const titheCount = 4 + (sundayIndex % 3)
      for (let i = 0; i < titheCount; i += 1) {
        const person = TITHES[(month * 7 + sundayIndex * 3 + i) % TITHES.length]
        push({
          type: 'entrada',
          category_id: categoryIdByName.get('Dízimos'),
          amount: money(person.amount * growth),
          entry_date: date,
          description: `Dízimo — ${person.who}`,
          payment_method: pickMethod(month + sundayIndex + i),
          entry_status: 'ativo',
        })
      }
    })

    push({
      type: 'saida',
      category_id: categoryIdByName.get('Aluguel'),
      amount: 3500,
      entry_date: ymd(year, month, 5),
      description: `Aluguel do templo — ${label}/${year}`,
      payment_method: 'transferencia',
      entry_status: 'ativo',
    })

    push({
      type: 'saida',
      category_id: categoryIdByName.get('Energia'),
      amount: money(310 + month * 18 + (month % 2) * 35.4),
      entry_date: ymd(year, month, 12),
      description: `Conta de energia — ${label}/${year}`,
      payment_method: 'pix',
      entry_status: 'ativo',
    })

    push({
      type: 'saida',
      category_id: categoryIdByName.get('Água'),
      amount: money(95 + month * 6.5),
      entry_date: ymd(year, month, 14),
      description: `Conta de água — ${label}/${year}`,
      payment_method: 'pix',
      entry_status: 'ativo',
    })

    push({
      type: 'saida',
      category_id: categoryIdByName.get('Internet'),
      amount: 119.9,
      entry_date: ymd(year, month, 8),
      description: `Internet e telefonia — ${label}/${year}`,
      payment_method: 'cartao',
      entry_status: 'ativo',
    })

    push({
      type: 'saida',
      category_id: categoryIdByName.get('Salários/ajuda de custo'),
      amount: 2800,
      entry_date: ymd(year, month, 5),
      description: `Ajuda de custo pastoral — ${label}/${year}`,
      payment_method: 'transferencia',
      entry_status: 'ativo',
    })

    push({
      type: 'saida',
      category_id: categoryIdByName.get('Salários/ajuda de custo'),
      amount: 1200,
      entry_date: ymd(year, month, 5),
      description: `Ajuda de custo da secretaria — ${label}/${year}`,
      payment_method: 'pix',
      entry_status: 'ativo',
    })

    if (month % 2 === 0) {
      push({
        type: 'saida',
        category_id: categoryIdByName.get('Material de culto'),
        amount: money(180 + month * 22),
        entry_date: ymd(year, month, 18),
        description: `Santa ceia e material de louvor — ${label}`,
        payment_method: 'pix',
        entry_status: 'ativo',
      })
    }

    if (month % 3 === 0) {
      push({
        type: 'saida',
        category_id: categoryIdByName.get('Manutenção'),
        amount: money(420 + month * 40),
        entry_date: ymd(year, month, 20),
        description: `Manutenção predial — ${label}/${year}`,
        payment_method: 'transferencia',
        entry_status: 'ativo',
      })
    }

    push({
      type: 'saida',
      category_id: categoryIdByName.get('Ajuda social'),
      amount: money(280 + month * 15),
      entry_date: ymd(year, month, 22),
      description: `Cestas básicas — ação social de ${label}`,
      payment_method: 'pix',
      entry_status: 'ativo',
    })

    if (month === 2 || month === 5 || month === 7) {
      push({
        type: 'entrada',
        category_id: categoryIdByName.get('Doações'),
        amount: month === 5 ? 2500 : 800,
        entry_date: ymd(year, month, 16),
        description:
          month === 5
            ? 'Doação de empresa parceira para reforma'
            : `Doação avulsa — ${label}/${year}`,
        payment_method: 'transferencia',
        entry_status: 'ativo',
      })
    }
  }

  push({
    type: 'entrada',
    category_id: categoryIdByName.get('Eventos'),
    amount: 4200,
    entry_date: '2026-03-15',
    description: 'Inscrições da Conferência de Famílias',
    payment_method: 'pix',
    entry_status: 'ativo',
  })
  push({
    type: 'saida',
    category_id: categoryIdByName.get('Outras despesas'),
    amount: 890.5,
    entry_date: '2026-03-14',
    description: 'Coffee break da Conferência de Famílias',
    payment_method: 'cartao',
    entry_status: 'ativo',
  })
  push({
    type: 'entrada',
    category_id: categoryIdByName.get('Eventos'),
    amount: 1860,
    entry_date: '2026-06-21',
    description: 'Bazar junino — vendas do sábado',
    payment_method: 'dinheiro',
    entry_status: 'ativo',
  })
  push({
    type: 'saida',
    category_id: categoryIdByName.get('Outras despesas'),
    amount: 340,
    entry_date: '2026-06-20',
    description: 'Compras para o bazar junino',
    payment_method: 'pix',
    entry_status: 'ativo',
  })
  push({
    type: 'entrada',
    category_id: categoryIdByName.get('Outras receitas'),
    amount: 150,
    entry_date: '2026-04-10',
    description: 'Venda de himnários usados',
    payment_method: 'dinheiro',
    entry_status: 'ativo',
  })
  push({
    type: 'saida',
    category_id: categoryIdByName.get('Manutenção'),
    amount: 1280,
    entry_date: '2026-07-09',
    description: 'Troca de lâmpadas e revisão elétrica',
    payment_method: 'transferencia',
    entry_status: 'ativo',
  })
  push({
    type: 'entrada',
    category_id: categoryIdByName.get('Ofertas'),
    amount: 320,
    entry_date: '2026-08-09',
    description: 'Oferta do culto de domingo — lançamento duplicado',
    payment_method: 'pix',
    entry_status: 'cancelado',
  })
  push({
    type: 'saida',
    category_id: categoryIdByName.get('Outras despesas'),
    amount: 75.9,
    entry_date: '2026-05-03',
    description: 'Material de escritório lançado na categoria errada',
    payment_method: 'dinheiro',
    entry_status: 'cancelado',
  })
  push({
    type: 'saida',
    category_id: categoryIdByName.get('Ajuda social'),
    amount: 450,
    entry_date: '2026-08-11',
    description: 'Auxílio emergencial à família da igreja',
    payment_method: 'pix',
    entry_status: 'ativo',
  })
  push({
    type: 'entrada',
    category_id: categoryIdByName.get('Doações'),
    amount: 1000,
    entry_date: '2026-08-20',
    description: 'Doação para campanha de cestas de inverno',
    payment_method: 'pix',
    entry_status: 'ativo',
  })

  return entries
}

async function main() {
  loadEnv()

  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_DATABASE || 'mychurch_db',
  })

  const categoryTable = await resolveTable(connection, [
    'finance_category',
    'FinanceCategory',
    'financecategory',
  ])
  const entryTable = await resolveTable(connection, [
    'finance_entry',
    'FinanceEntry',
    'financeentry',
  ])
  const userTable = await resolveTable(connection, ['user', 'User'])

  const [admins] = await connection.query(
    `SELECT id FROM \`${userTable}\` WHERE role = 'admin' AND status = 1 ORDER BY created_at ASC LIMIT 1`,
  )
  const createdBy = admins[0]?.id ?? null

  const categoryIdByName = new Map()
  let categoriesInserted = 0
  let categoriesSkipped = 0

  for (const category of CATEGORIES) {
    const [existing] = await connection.query(
      `SELECT id FROM \`${categoryTable}\` WHERE name = ? AND type = ? LIMIT 1`,
      [category.name, category.type],
    )

    if (existing.length > 0) {
      categoryIdByName.set(category.name, existing[0].id)
      categoriesSkipped += 1
      continue
    }

    const id = randomUUID()
    await connection.query(
      `INSERT INTO \`${categoryTable}\` (id, name, type, description, status, created_at)
       VALUES (?, ?, ?, ?, 1, NOW(6))`,
      [id, category.name, category.type, category.description],
    )
    categoryIdByName.set(category.name, id)
    categoriesInserted += 1
  }

  const entries = buildEntries(categoryIdByName)
  const insertEntrySql = `
    INSERT INTO \`${entryTable}\` (
      id, type, category_id, amount, entry_date, description, payment_method,
      created_by, attachment, entry_status, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(6))
  `

  let entriesInserted = 0
  let entriesSkipped = 0

  for (const entry of entries) {
    const [existing] = await connection.query(
      `SELECT id FROM \`${entryTable}\`
       WHERE entry_date = ? AND amount = ? AND description = ? AND category_id = ?
       LIMIT 1`,
      [entry.entry_date, entry.amount, entry.description, entry.category_id],
    )

    if (existing.length > 0) {
      entriesSkipped += 1
      continue
    }

    await connection.query(insertEntrySql, [
      entry.id,
      entry.type,
      entry.category_id,
      entry.amount,
      entry.entry_date,
      entry.description,
      entry.payment_method,
      createdBy,
      entry.attachment,
      entry.entry_status,
      entry.status,
    ])
    entriesInserted += 1
  }

  const [[{ totalCategories }]] = await connection.query(
    `SELECT COUNT(*) AS totalCategories FROM \`${categoryTable}\``,
  )
  const [[{ totalEntries }]] = await connection.query(
    `SELECT COUNT(*) AS totalEntries FROM \`${entryTable}\``,
  )
  await connection.end()

  console.log(`Categorias inseridas: ${categoriesInserted}`)
  console.log(`Categorias já existiam (reutilizadas): ${categoriesSkipped}`)
  console.log(`Lançamentos inseridos: ${entriesInserted}`)
  console.log(`Lançamentos já existiam (ignorados): ${entriesSkipped}`)
  console.log(`Total na tabela de categorias: ${totalCategories}`)
  console.log(`Total na tabela de lançamentos: ${totalEntries}`)
}

main().catch((error) => {
  const detail = error.code
    ? `${error.code}${error.message ? ` — ${error.message}` : ''}`
    : error.message || String(error)
  console.error('Falha ao gerar massa financeira:', detail)
  if (error.code === 'ECONNREFUSED') {
    console.error(
      'MySQL não está acessível. Inicie o WampServer (ícone verde) e rode de novo: npm run seed:finance',
    )
  }
  process.exit(1)
})
