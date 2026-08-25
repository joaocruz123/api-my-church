import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AgendaItem } from '../entities/agenda-item.entity'

@Injectable()
export class FindCalendarAgendaItemUseCase {
  constructor(
    @InjectRepository(AgendaItem)
    private readonly agendaItemRepo: Repository<AgendaItem>,
  ) {}

  execute(year: number, month: number) {
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 1)

    return this.agendaItemRepo
      .createQueryBuilder('item')
      .where('item.status = :status', { status: true })
      .andWhere('item.starts_at >= :start AND item.starts_at < :end', {
        start,
        end,
      })
      .orderBy('item.starts_at', 'ASC')
      .getMany()
  }
}
