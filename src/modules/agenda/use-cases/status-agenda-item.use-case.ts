import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateAgendaItemDto } from '../dto/update-agenda-item.dto'
import { AgendaItem } from '../entities/agenda-item.entity'

@Injectable()
export class StatusAgendaItemUseCase {
  constructor(
    @InjectRepository(AgendaItem)
    private readonly agendaItemRepo: Repository<AgendaItem>,
  ) {}

  async execute(id: string, input: UpdateAgendaItemDto) {
    const agendaItem = await this.agendaItemRepo.findOneOrFail({
      where: { id },
    })

    if (input.status !== undefined) agendaItem.status = input.status
    if (input.item_status !== undefined) {
      agendaItem.item_status = input.item_status
    }

    return this.agendaItemRepo.save(agendaItem)
  }
}
