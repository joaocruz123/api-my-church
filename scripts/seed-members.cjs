/**
 * Gera massa de membros para desenvolvimento.
 * Uso: npm run seed:members
 *
 * Não sobrescreve registros existentes (compara por CPF/e-mail).
 */
const { randomUUID } = require('crypto')
const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')

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

function cpfDigits(index) {
  const n = String(200000000 + index * 37)
    .padStart(9, '0')
    .slice(-9)
    .split('')
    .map(Number)
  const digit = (slice, factor) => {
    const sum = slice.reduce((acc, num, i) => acc + num * (factor - i), 0)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  const d1 = digit(n, 10)
  const d2 = digit([...n, d1], 11)
  return [...n, d1, d2].join('')
}

function phone(index) {
  return `1198${String(1000000 + index).slice(-7)}`
}

const ADDRESSES = [
  {
    cep: '01310100',
    street: 'Av. Paulista',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
  },
  {
    cep: '13015111',
    street: 'Rua Barão de Jaguara',
    neighborhood: 'Centro',
    city: 'Campinas',
    state: 'SP',
  },
  {
    cep: '07011000',
    street: 'Rua Timóteo Penteado',
    neighborhood: 'Macedo',
    city: 'Guarulhos',
    state: 'SP',
  },
  {
    cep: '06016010',
    street: 'Av. dos Autonomistas',
    neighborhood: 'Centro',
    city: 'Osasco',
    state: 'SP',
  },
  {
    cep: '09015100',
    street: 'Rua Marechal Deodoro',
    neighborhood: 'Centro',
    city: 'Santo André',
    state: 'SP',
  },
  {
    cep: '09726000',
    street: 'Av. Kennedy',
    neighborhood: 'Assunção',
    city: 'São Bernardo do Campo',
    state: 'SP',
  },
  {
    cep: '13201000',
    street: 'Rua do Rosário',
    neighborhood: 'Centro',
    city: 'Jundiaí',
    state: 'SP',
  },
  {
    cep: '11060000',
    street: 'Av. Ana Costa',
    neighborhood: 'Gonzaga',
    city: 'Santos',
    state: 'SP',
  },
]

const PEOPLE = [
  {
    name: 'João Pedro Almeida',
    gender: 'masculino',
    date_birth: '1982-04-18',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Carla Almeida',
    ministry: 'Diaconato',
  },
  {
    name: 'Ana Clara Ferreira',
    gender: 'feminino',
    date_birth: '1994-09-03',
    member_status: 'ativo',
    marital_status: 'solteiro',
    ministry: 'Kids',
  },
  {
    name: 'Carlos Eduardo Lima',
    gender: 'masculino',
    date_birth: '1988-01-22',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Patrícia Lima',
    ministry: 'Mídia',
  },
  {
    name: 'Fernanda Costa Oliveira',
    gender: 'feminino',
    date_birth: '1991-06-14',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Ricardo Oliveira',
    ministry: 'Intercessão',
  },
  {
    name: 'Rafael Santos Pereira',
    gender: 'masculino',
    date_birth: '1998-11-07',
    member_status: 'ativo',
    marital_status: 'solteiro',
    ministry: 'Jovens',
  },
  {
    name: 'Juliana Rocha Martins',
    gender: 'feminino',
    date_birth: '1986-02-28',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Fábio Martins',
    ministry: 'Recepção',
  },
  {
    name: 'Bruno Henrique Silva',
    gender: 'masculino',
    date_birth: '1979-08-11',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Luciana Silva',
    ministry: 'Ensino',
  },
  {
    name: 'Patrícia Alves Nunes',
    gender: 'feminino',
    date_birth: '1984-12-19',
    member_status: 'ativo',
    marital_status: 'divorciado',
    ministry: 'Ação Social',
  },
  {
    name: 'Lucas Gabriel Mendes',
    gender: 'masculino',
    date_birth: '2001-05-02',
    member_status: 'ativo',
    marital_status: 'solteiro',
    ministry: 'Louvor',
  },
  {
    name: 'Camila Dias Barbosa',
    gender: 'feminino',
    date_birth: '1993-07-25',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'André Barbosa',
    ministry: 'Kids',
  },
  {
    name: 'Thiago Moreira Pinto',
    gender: 'masculino',
    date_birth: '1987-03-09',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Aline Pinto',
    ministry: 'Missões',
  },
  {
    name: 'Beatriz Carvalho Gomes',
    gender: 'feminino',
    date_birth: '1990-10-16',
    member_status: 'ativo',
    marital_status: 'solteiro',
    ministry: 'Intercessão',
  },
  {
    name: 'Felipe Augusto Ribeiro',
    gender: 'masculino',
    date_birth: '1995-01-30',
    member_status: 'ativo',
    marital_status: 'solteiro',
    ministry: 'Mídia',
  },
  {
    name: 'Larissa Teixeira Araújo',
    gender: 'feminino',
    date_birth: '1999-04-08',
    member_status: 'ativo',
    marital_status: 'solteiro',
    ministry: 'Jovens',
  },
  {
    name: 'André Luiz Cardoso',
    gender: 'masculino',
    date_birth: '1976-09-21',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Simone Cardoso',
    ministry: 'Diaconato',
  },
  {
    name: 'Gabriela Souza Pinto',
    gender: 'feminino',
    date_birth: '1992-08-05',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Paulo Pinto',
    ministry: 'Louvor',
  },
  {
    name: 'Marcelo Vieira Castro',
    gender: 'masculino',
    date_birth: '1981-06-27',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Renata Castro',
    ministry: 'Ensino',
  },
  {
    name: 'Renata Aparecida Lopes',
    gender: 'feminino',
    date_birth: '1978-11-13',
    member_status: 'ativo',
    marital_status: 'viuvo',
    ministry: 'Recepção',
  },
  {
    name: 'Diego Fernandes Moraes',
    gender: 'masculino',
    date_birth: '2000-02-14',
    member_status: 'ativo',
    marital_status: 'solteiro',
    ministry: 'Jovens',
  },
  {
    name: 'Aline Cristina Batista',
    gender: 'feminino',
    date_birth: '1989-05-19',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Roberto Batista',
    ministry: 'Kids',
  },
  {
    name: 'Rodrigo Cunha Azevedo',
    gender: 'masculino',
    date_birth: '1983-12-01',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Vanessa Azevedo',
    ministry: 'Missões',
  },
  {
    name: 'Vanessa Oliveira Freitas',
    gender: 'feminino',
    date_birth: '1996-03-23',
    member_status: 'ativo',
    marital_status: 'solteiro',
    ministry: 'Intercessão',
  },
  {
    name: 'Gustavo Henrique Nascimento',
    gender: 'masculino',
    date_birth: '1997-07-17',
    member_status: 'ativo',
    marital_status: 'solteiro',
    ministry: 'Mídia',
  },
  {
    name: 'Priscila Mendes Correia',
    gender: 'feminino',
    date_birth: '1985-09-29',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Eduardo Correia',
    ministry: 'Ação Social',
  },
  {
    name: 'Eduardo Ramos Farias',
    gender: 'masculino',
    date_birth: '1974-04-04',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Márcia Farias',
    ministry: 'Diaconato',
  },
  {
    name: 'Bruna Silva Monteiro',
    gender: 'feminino',
    date_birth: '2002-08-22',
    member_status: 'ativo',
    marital_status: 'solteiro',
    ministry: 'Louvor',
  },
  {
    name: 'Leandro Costa Magalhães',
    gender: 'masculino',
    date_birth: '1980-10-10',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Daniela Magalhães',
    ministry: 'Ensino',
  },
  {
    name: 'Amanda Ferreira Campos',
    gender: 'feminino',
    date_birth: '1994-01-06',
    member_status: 'ativo',
    marital_status: 'solteiro',
    ministry: 'Recepção',
  },
  {
    name: 'Caio Bruno Teixeira',
    gender: 'masculino',
    date_birth: '1998-06-18',
    member_status: 'ativo',
    marital_status: 'solteiro',
    ministry: 'Jovens',
  },
  {
    name: 'Natália Souza Reis',
    gender: 'feminino',
    date_birth: '1991-12-12',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Igor Reis',
    ministry: 'Kids',
  },
  {
    name: 'Wellington Alves Pacheco',
    gender: 'masculino',
    date_birth: '1986-02-09',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Sueli Pacheco',
    ministry: 'Mídia',
  },
  {
    name: 'Sueli Aparecida Ramos',
    gender: 'feminino',
    date_birth: '1972-07-03',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Antônio Ramos',
    ministry: 'Ação Social',
  },
  {
    name: 'Igor Santos Mello',
    gender: 'masculino',
    date_birth: '2003-03-15',
    member_status: 'ativo',
    marital_status: 'solteiro',
    ministry: 'Louvor',
  },
  {
    name: 'Mônica Helena Duarte',
    gender: 'feminino',
    date_birth: '1977-05-26',
    member_status: 'ativo',
    marital_status: 'divorciado',
    ministry: 'Ensino',
  },
  {
    name: 'Fábio Luiz Correia',
    gender: 'masculino',
    date_birth: '1984-11-08',
    member_status: 'ativo',
    marital_status: 'casado',
    spouse_name: 'Tatiane Correia',
    ministry: 'Missões',
  },
  {
    name: 'Daniela Souza Prado',
    gender: 'feminino',
    date_birth: '1988-04-21',
    member_status: 'inativo',
    marital_status: 'casado',
    spouse_name: 'Marcos Prado',
    ministry: 'Louvor',
  },
  {
    name: 'Paulo Roberto Duarte',
    gender: 'masculino',
    date_birth: '1969-09-14',
    member_status: 'inativo',
    marital_status: 'casado',
    spouse_name: 'Helena Duarte',
    ministry: 'Diaconato',
  },
  {
    name: 'Cristina Helena Pires',
    gender: 'feminino',
    date_birth: '1975-01-27',
    member_status: 'inativo',
    marital_status: 'viuvo',
    ministry: 'Kids',
  },
  {
    name: 'Márcio Antônio Barros',
    gender: 'masculino',
    date_birth: '1983-08-31',
    member_status: 'inativo',
    marital_status: 'solteiro',
    ministry: null,
  },
  {
    name: 'Tatiane Cristina Vieira',
    gender: 'feminino',
    date_birth: '1990-06-02',
    member_status: 'inativo',
    marital_status: 'casado',
    spouse_name: 'Leandro Vieira',
    ministry: 'Recepção',
  },
  {
    name: 'Isabella Nogueira Lima',
    gender: 'feminino',
    date_birth: '2004-10-20',
    member_status: 'visitante',
    marital_status: 'solteiro',
    ministry: null,
  },
  {
    name: 'Henrique Toledo Sampaio',
    gender: 'masculino',
    date_birth: '1992-02-11',
    member_status: 'visitante',
    marital_status: 'casado',
    spouse_name: 'Carla Sampaio',
    ministry: null,
  },
  {
    name: 'Sofia Martins Peixoto',
    gender: 'feminino',
    date_birth: '1987-07-07',
    member_status: 'visitante',
    marital_status: 'solteiro',
    ministry: null,
  },
  {
    name: 'Vinícius Rocha Guimarães',
    gender: 'masculino',
    date_birth: '1999-12-24',
    member_status: 'visitante',
    marital_status: 'solteiro',
    ministry: null,
  },
  {
    name: 'Enzo Gabriel Costa',
    gender: 'masculino',
    date_birth: '2006-05-05',
    member_status: 'visitante',
    marital_status: 'solteiro',
    ministry: null,
  },
  {
    name: 'Eliane Cristina Moura',
    gender: 'feminino',
    date_birth: '1980-03-18',
    member_status: 'transferido',
    marital_status: 'casado',
    spouse_name: 'Sérgio Moura',
    ministry: 'Louvor',
  },
  {
    name: 'Roberto Carlos Neves',
    gender: 'masculino',
    date_birth: '1971-11-29',
    member_status: 'transferido',
    marital_status: 'casado',
    spouse_name: 'Lúcia Neves',
    ministry: 'Diaconato',
  },
  {
    name: 'Aparecida Conceição Silva',
    gender: 'feminino',
    date_birth: '1948-04-13',
    member_status: 'falecido',
    marital_status: 'viuvo',
    ministry: 'Intercessão',
  },
  {
    name: 'José Antônio Oliveira',
    gender: 'masculino',
    date_birth: '1942-08-16',
    member_status: 'falecido',
    marital_status: 'casado',
    spouse_name: 'Maria Oliveira',
    ministry: 'Diaconato',
  },
  {
    name: 'Helena Maria Barbosa',
    gender: 'feminino',
    date_birth: '1955-02-02',
    member_status: 'falecido',
    marital_status: 'viuvo',
    ministry: 'Ação Social',
  },
]

function emailFromName(name, index) {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
    .replace(/\s+/g, '.')
  return `${slug}.${index + 1}@mychurch.app`
}

function buildMembers() {
  return PEOPLE.map((person, index) => {
    const address = ADDRESSES[index % ADDRESSES.length]
    const isVisitor = person.member_status === 'visitante'
    const isDeceased = person.member_status === 'falecido'
    const birthYear = Number(person.date_birth.slice(0, 4))
    const baptismYear = Math.min(birthYear + 16, 2022)
    const membershipYear = Math.min(baptismYear + 2, 2024)

    return {
      id: randomUUID(),
      name: person.name,
      date_birth: person.date_birth,
      gender: person.gender,
      phone: phone(index),
      member_status: person.member_status,
      cpf: isVisitor && index % 2 === 0 ? null : cpfDigits(index + 1),
      email: emailFromName(person.name, index),
      cep: address.cep,
      street: address.street,
      number: String(40 + index * 7),
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      marital_status: person.marital_status,
      spouse_name: person.spouse_name ?? null,
      baptism_date: isVisitor ? null : `${baptismYear}-06-15`,
      membership_date: isVisitor || isDeceased ? null : `${membershipYear}-03-10`,
      ministry: person.ministry,
      emergency_contact_name: person.spouse_name ?? 'Contato familiar',
      emergency_contact_phone: phone(index + 80),
      notes: isVisitor
        ? 'Visitante recente — acompanhar integração.'
        : isDeceased
          ? 'Registro histórico para memória da igreja.'
          : null,
      avatar: null,
      status: 1,
    }
  })
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

  const members = buildMembers()
  const sql = `
    INSERT INTO member (
      id, name, date_birth, gender, phone, member_status, cpf, email,
      cep, street, number, neighborhood, city, state, marital_status,
      spouse_name, baptism_date, membership_date, ministry,
      emergency_contact_name, emergency_contact_phone, notes, avatar,
      status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(6))
  `

  let inserted = 0
  let skipped = 0

  for (const member of members) {
    const [existing] = await connection.query(
      `SELECT id FROM member
       WHERE email = ?
          OR (cpf IS NOT NULL AND cpf = ?)
       LIMIT 1`,
      [member.email, member.cpf],
    )

    if (existing.length > 0) {
      skipped += 1
      continue
    }

    await connection.query(sql, [
      member.id,
      member.name,
      member.date_birth,
      member.gender,
      member.phone,
      member.member_status,
      member.cpf,
      member.email,
      member.cep,
      member.street,
      member.number,
      member.neighborhood,
      member.city,
      member.state,
      member.marital_status,
      member.spouse_name,
      member.baptism_date,
      member.membership_date,
      member.ministry,
      member.emergency_contact_name,
      member.emergency_contact_phone,
      member.notes,
      member.avatar,
      member.status,
    ])
    inserted += 1
  }

  const [[{ total }]] = await connection.query('SELECT COUNT(*) AS total FROM member')
  await connection.end()

  console.log(`Membros inseridos: ${inserted}`)
  console.log(`Já existiam (ignorados): ${skipped}`)
  console.log(`Total na tabela member: ${total}`)
}

main().catch((error) => {
  console.error('Falha ao gerar massa de membros:', error.message)
  process.exit(1)
})
