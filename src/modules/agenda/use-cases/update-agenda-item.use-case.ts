import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateAgendaItemDto } from '../dto/update-agenda-item.dto'
import { AgendaItem } from '../entities/agenda-item.entity'

@Injectable()
export class UpdateAgendaItemUseCase {
  constructor(
    @InjectRepository(AgendaItem)
    private readonly agendaItemRepo: Repository<AgendaItem>,
  ) {}

  async execute(id: string, input: UpdateAgendaItemDto) {
    const agendaItem = await this.agendaItemRepo.findOneOrFail({
      where: { id },
    })

    input.title && (agendaItem.title = input.title)
    input.description !== undefined &&
      (agendaItem.description = input.description)
    input.starts_at && (agendaItem.starts_at = input.starts_at)
    input.ends_at !== undefined && (agendaItem.ends_at = input.ends_at)
    input.location !== undefined && (agendaItem.location = input.location)
    input.type && (agendaItem.type = input.type)
    input.responsible !== undefined &&
      (agendaItem.responsible = input.responsible)
    input.item_status && (agendaItem.item_status = input.item_status)

    return this.agendaItemRepo.save(agendaItem)
  }
}
