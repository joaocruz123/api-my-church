import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FinanceCategory } from '../../finance-categories/entities/finance-category.entity'
import { FinanceEntry } from '../entities/finance-entry.entity'

export type FinanceSummaryResult = {
  year: number
  month: number
  entradas: number
  saidas: number
  saldo: number
  saldoAcumulado: number
  byCategory: Array<{
    categoryId: string
    categoryName: string
    type: 'entrada' | 'saida'
    total: number
  }>
}

@Injectable()
export class GetFinanceSummaryUseCase {
  constructor(
    @InjectRepository(FinanceEntry)
    private readonly entryRepo: Repository<FinanceEntry>,
    @InjectRepository(FinanceCategory)
    private readonly categoryRepo: Repository<FinanceCategory>,
  ) {}

  async execute(year: number, month: number): Promise<FinanceSummaryResult> {
    const start = this.toDate(year, month, 1)
    const next = month === 12 ? this.toDate(year + 1, 1, 1) : this.toDate(year, month + 1, 1)

    const monthEntries = await this.entryRepo
      .createQueryBuilder('entry')
      .where('entry.entry_status = :status', { status: 'ativo' })
      .andWhere('entry.status = :flag', { flag: true })
      .andWhere('entry.entry_date >= :start AND entry.entry_date < :next', {
        start,
        next,
      })
      .getMany()

    const accumulatedEntries = await this.entryRepo
      .createQueryBuilder('entry')
      .where('entry.entry_status = :status', { status: 'ativo' })
      .andWhere('entry.status = :flag', { flag: true })
      .andWhere('entry.entry_date < :next', { next })
      .getMany()

    const entradas = this.sumByType(monthEntries, 'entrada')
    const saidas = this.sumByType(monthEntries, 'saida')
    const saldoAcumulado =
      this.sumByType(accumulatedEntries, 'entrada') -
      this.sumByType(accumulatedEntries, 'saida')

    const categories = await this.categoryRepo.find()
    const nameById = new Map(categories.map((c) => [c.id, c.name]))

    const totals = new Map<string, { type: 'entrada' | 'saida'; total: number }>()
    for (const entry of monthEntries) {
      const current = totals.get(entry.category_id) ?? {
        type: entry.type,
        total: 0,
      }
      current.total += Number(entry.amount)
      totals.set(entry.category_id, current)
    }

    return {
      year,
      month,
      entradas,
      saidas,
      saldo: entradas - saidas,
      saldoAcumulado,
      byCategory: [...totals.entries()].map(([categoryId, value]) => ({
        categoryId,
        categoryName: nameById.get(categoryId) ?? 'Sem categoria',
        type: value.type,
        total: value.total,
      })),
    }
  }

  private sumByType(entries: FinanceEntry[], type: 'entrada' | 'saida') {
    return entries
      .filter((entry) => entry.type === type)
      .reduce((acc, entry) => acc + Number(entry.amount), 0)
  }

  private toDate(year: number, month: number, day: number) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
}
