import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AgendaItem } from '../entities/agenda-item.entity'

@Injectable()
export class FindIdAgendaItemUseCase {
  constructor(
    @InjectRepository(AgendaItem)
    private readonly agendaItemRepo: Repository<AgendaItem>,
  ) {}

  execute(id: string) {
    return this.agendaItemRepo.findOneOrFail({ where: { id } })
  }
}
