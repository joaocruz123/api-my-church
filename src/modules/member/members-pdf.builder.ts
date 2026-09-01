import PDFDocument from 'pdfkit'
import { Member } from './entities/member.entity'
import {
  describeMemberFilters,
  type MemberListFilters,
} from './member-filters'

const MARGIN = 36
const ROW_HEIGHT = 20
const HEADER_HEIGHT = 22
const FOOTER_HEIGHT = 24
const STATUS_LABEL: Record<Member['member_status'], string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  visitante: 'Visitante',
  transferido: 'Transferido',
  falecido: 'Falecido',
}

const COLUMNS = [
  { key: 'name', label: 'Nome', width: 150 },
  { key: 'phone', label: 'Telefone', width: 95 },
  { key: 'member_status', label: 'Status', width: 78 },
  { key: 'ministry', label: 'Ministério', width: 110 },
  { key: 'date_birth', label: 'Nascimento', width: 78 },
  { key: 'city', label: 'Cidade', width: 95 },
  { key: 'email', label: 'E-mail', width: 164 },
] as const

type ColumnKey = (typeof COLUMNS)[number]['key']

function formatDate(value: Date | string | null | undefined) {
  if (!value) return '—'
  if (typeof value === 'string') {
    const [year, month, day] = value.slice(0, 10).split('-')
    if (year && month && day) return `${day}/${month}/${year}`
    return value
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear()
    const month = String(value.getUTCMonth() + 1).padStart(2, '0')
    const day = String(value.getUTCDate()).padStart(2, '0')
    return `${day}/${month}/${year}`
  }
  return '—'
}

function formatPhone(value?: string | null) {
  if (!value) return '—'
  const digits = value.replace(/\D/g, '')
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return value
}

function cellValue(member: Member, key: ColumnKey) {
  switch (key) {
    case 'name':
      return member.name || '—'
    case 'phone':
      return formatPhone(member.phone)
    case 'member_status':
      return STATUS_LABEL[member.member_status] ?? member.member_status
    case 'ministry':
      return member.ministry?.trim() || '—'
    case 'date_birth':
      return formatDate(member.date_birth)
    case 'city':
      return member.city?.trim() || '—'
    case 'email':
      return member.email?.trim() || '—'
  }
}

function tableWidth() {
  return COLUMNS.reduce((sum, column) => sum + column.width, 0)
}

function contentBottom(doc: PDFKit.PDFDocument) {
  return doc.page.height - MARGIN - FOOTER_HEIGHT
}

function drawTableHeader(doc: PDFKit.PDFDocument, y: number) {
  let x = MARGIN
  doc.save()
  doc.rect(MARGIN, y, tableWidth(), HEADER_HEIGHT).fill('#1f3a5f')
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8)
  for (const column of COLUMNS) {
    doc.text(column.label, x + 4, y + 6, {
      width: column.width - 8,
      ellipsis: true,
    })
    x += column.width
  }
  doc.restore()
  return y + HEADER_HEIGHT
}

function drawRow(doc: PDFKit.PDFDocument, member: Member, y: number, index: number) {
  let x = MARGIN
  if (index % 2 === 0) {
    doc.save()
    doc.rect(MARGIN, y, tableWidth(), ROW_HEIGHT).fill('#f4f7fb')
    doc.restore()
  }
  doc.fillColor('#1f2933').font('Helvetica').fontSize(8)
  for (const column of COLUMNS) {
    doc.text(cellValue(member, column.key), x + 4, y + 5, {
      width: column.width - 8,
      ellipsis: true,
      lineBreak: false,
    })
    x += column.width
  }
  doc
    .strokeColor('#e5e7eb')
    .lineWidth(0.4)
    .moveTo(MARGIN, y + ROW_HEIGHT)
    .lineTo(MARGIN + tableWidth(), y + ROW_HEIGHT)
    .stroke()
  return y + ROW_HEIGHT
}

function writeLine(
  doc: PDFKit.PDFDocument,
  text: string,
  x: number,
  y: number,
  options: PDFKit.Mixins.TextOptions = {},
) {
  doc.text(text, x, y, {
    lineBreak: false,
    ...options,
  })
}

function drawPageChrome(
  doc: PDFKit.PDFDocument,
  filters: MemberListFilters,
  total: number,
) {
  const generatedAt = new Date().toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
  doc.fillColor('#1f3a5f').font('Helvetica-Bold').fontSize(16)
  writeLine(doc, 'myChurch', MARGIN, MARGIN)
  doc.fontSize(13).fillColor('#111827')
  writeLine(doc, 'Relatório de Membros', MARGIN, MARGIN + 22)
  doc.font('Helvetica').fontSize(9).fillColor('#4b5563')
  writeLine(doc, `Gerado em ${generatedAt}`, MARGIN, MARGIN + 42)
  writeLine(doc, `Total: ${total} membro(s)`, MARGIN, MARGIN + 54)
  writeLine(doc, describeMemberFilters(filters), MARGIN, MARGIN + 66, {
    width: tableWidth(),
    ellipsis: true,
  })
  return MARGIN + 88
}

export function buildMembersPdf(
  members: Member[],
  filters: MemberListFilters,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 36, left: 36, right: 36, bottom: 18 },
      bufferPages: true,
      info: {
        Title: 'Relatório de Membros',
        Author: 'myChurch',
      },
    })
    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk as Buffer))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    let y = drawPageChrome(doc, filters, members.length)
    y = drawTableHeader(doc, y)

    if (members.length === 0) {
      doc.font('Helvetica').fontSize(10).fillColor('#4b5563')
      doc.text(
        'Nenhum membro encontrado para os filtros aplicados.',
        MARGIN,
        y + 16,
      )
    } else {
      members.forEach((member, index) => {
        if (y + ROW_HEIGHT > contentBottom(doc)) {
          doc.addPage()
          y = drawPageChrome(doc, filters, members.length)
          y = drawTableHeader(doc, y)
        }
        y = drawRow(doc, member, y, index)
      })
    }

    const range = doc.bufferedPageRange()
    for (let i = 0; i < range.count; i += 1) {
      doc.switchToPage(range.start + i)
      doc.page.margins.bottom = 0
      doc.font('Helvetica').fontSize(8).fillColor('#6b7280')
      writeLine(
        doc,
        `Página ${i + 1} de ${range.count}`,
        MARGIN,
        doc.page.height - 22,
        { width: tableWidth(), align: 'right' },
      )
    }

    doc.end()
  })
}
