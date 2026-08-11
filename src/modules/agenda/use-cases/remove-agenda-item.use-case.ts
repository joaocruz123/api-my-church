import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AgendaItem } from '../entities/agenda-item.entity'

@Injectable()
export class RemoveAgendaItemUseCase {
  constructor(
    @InjectRepository(AgendaItem)
    private readonly agendaItemRepo: Repository<AgendaItem>,
  ) {}

  async execute(id: string) {
    const agendaItem = await this.agendaItemRepo.findOneOrFail({
      where: { id },
    })
    return this.agendaItemRepo.remove(agendaItem)
  }
}
