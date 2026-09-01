import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FinanceEntry } from '../entities/finance-entry.entity'

export type FinanceDaySummary = {
  day: number
  entradas: number
  saidas: number
  saldo: number
}

export type FinanceDailySummaryResult = {
  year: number
  month: number
  days: FinanceDaySummary[]
  totals: {
    entradas: number
    saidas: number
    saldo: number
  }
}

@Injectable()
export class GetFinanceDailySummaryUseCase {
  constructor(
    @InjectRepository(FinanceEntry)
    private readonly entryRepo: Repository<FinanceEntry>,
  ) {}

  async execute(year: number, month: number): Promise<FinanceDailySummaryResult> {
    const start = this.toDate(year, month, 1)
    const next =
      month === 12
        ? this.toDate(year + 1, 1, 1)
        : this.toDate(year, month + 1, 1)
    const daysInMonth = new Date(year, month, 0).getDate()

    const entries = await this.entryRepo
      .createQueryBuilder('entry')
      .where('entry.entry_status = :status', { status: 'ativo' })
      .andWhere('entry.status = :flag', { flag: true })
      .andWhere('entry.entry_date >= :start AND entry.entry_date < :next', {
        start,
        next,
      })
      .getMany()

    const days: FinanceDaySummary[] = Array.from(
      { length: daysInMonth },
      (_, index) => ({
        day: index + 1,
        entradas: 0,
        saidas: 0,
        saldo: 0,
      }),
    )

    for (const entry of entries) {
      const day = this.dayFromDate(entry.entry_date)
      if (day < 1 || day > daysInMonth) continue
      const bucket = days[day - 1]
      const amount = Number(entry.amount) || 0
      if (entry.type === 'entrada') bucket.entradas += amount
      if (entry.type === 'saida') bucket.saidas += amount
    }

    for (const bucket of days) {
      bucket.saldo = bucket.entradas - bucket.saidas
    }

    const entradas = days.reduce((sum, item) => sum + item.entradas, 0)
    const saidas = days.reduce((sum, item) => sum + item.saidas, 0)

    return {
      year,
      month,
      days,
      totals: {
        entradas,
        saidas,
        saldo: entradas - saidas,
      },
    }
  }

  private dayFromDate(value: Date | string): number {
    if (typeof value === 'string') {
      const day = Number(value.slice(8, 10))
      return Number.isFinite(day) ? day : 0
    }
    return value.getDate()
  }

  private toDate(year: number, month: number, day: number) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
}
