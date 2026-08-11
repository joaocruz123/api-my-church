import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateAgendaItemDto } from '../dto/create-agenda-item.dto'
import { AgendaItem } from '../entities/agenda-item.entity'

@Injectable()
export class CreateAgendaItemUseCase {
  constructor(
    @InjectRepository(AgendaItem)
    private readonly agendaItemRepo: Repository<AgendaItem>,
  ) {}

  execute(input: CreateAgendaItemDto) {
    const agendaItem = new AgendaItem(input)
    return this.agendaItemRepo.save(agendaItem)
  }
}
