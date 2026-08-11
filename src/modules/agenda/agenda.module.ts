import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AgendaController } from './agenda.controller'
import { AgendaItem } from './entities/agenda-item.entity'
import { CreateAgendaItemUseCase } from './use-cases/create-agenda-item.use-case'
import { FindAllAgendaItemUseCase } from './use-cases/find-all.use-case'
import { FindIdAgendaItemUseCase } from './use-cases/find-id.use-case'
import { RemoveAgendaItemUseCase } from './use-cases/remove-agenda-item.use-case'
import { StatusAgendaItemUseCase } from './use-cases/status-agenda-item.use-case'
import { UpdateAgendaItemUseCase } from './use-cases/update-agenda-item.use-case'

@Module({
  imports: [TypeOrmModule.forFeature([AgendaItem])],
  controllers: [AgendaController],
  providers: [
    CreateAgendaItemUseCase,
    FindAllAgendaItemUseCase,
    FindIdAgendaItemUseCase,
    UpdateAgendaItemUseCase,
    StatusAgendaItemUseCase,
    RemoveAgendaItemUseCase,
  ],
})
export class AgendaModule {}
