import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FinanceEntry } from '../entities/finance-entry.entity'

export type FinanceYearMonthSummary = {
  month: number
  entradas: number
  saidas: number
  saldo: number
}

export type FinanceYearlySummaryResult = {
  year: number
  months: FinanceYearMonthSummary[]
  totals: {
    entradas: number
    saidas: number
    saldo: number
  }
}

@Injectable()
export class GetFinanceYearlySummaryUseCase {
  constructor(
    @InjectRepository(FinanceEntry)
    private readonly entryRepo: Repository<FinanceEntry>,
  ) {}

  async execute(year: number): Promise<FinanceYearlySummaryResult> {
    const start = `${year}-01-01`
    const next = `${year + 1}-01-01`

    const entries = await this.entryRepo
      .createQueryBuilder('entry')
      .where('entry.entry_status = :status', { status: 'ativo' })
      .andWhere('entry.status = :flag', { flag: true })
      .andWhere('entry.entry_date >= :start AND entry.entry_date < :next', {
        start,
        next,
      })
      .getMany()

    const months: FinanceYearMonthSummary[] = Array.from(
      { length: 12 },
      (_, index) => ({
        month: index + 1,
        entradas: 0,
        saidas: 0,
        saldo: 0,
      }),
    )

    for (const entry of entries) {
      const month = this.monthFromDate(entry.entry_date)
      if (month < 1 || month > 12) continue
      const bucket = months[month - 1]
      const amount = Number(entry.amount) || 0
      if (entry.type === 'entrada') bucket.entradas += amount
      if (entry.type === 'saida') bucket.saidas += amount
    }

    for (const bucket of months) {
      bucket.saldo = bucket.entradas - bucket.saidas
    }

    const entradas = months.reduce((sum, item) => sum + item.entradas, 0)
    const saidas = months.reduce((sum, item) => sum + item.saidas, 0)

    return {
      year,
      months,
      totals: {
        entradas,
        saidas,
        saldo: entradas - saidas,
      },
    }
  }

  private monthFromDate(value: Date | string): number {
    if (typeof value === 'string') {
      const month = Number(value.slice(5, 7))
      return Number.isFinite(month) ? month : 0
    }
    return value.getMonth() + 1
  }
}
