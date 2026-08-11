import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmConfigService } from './config/config.service'
import { AgendaModule } from './modules/agenda/agenda.module'
import { AnnouncementsModule } from './modules/announcements/announcements.module'
import { FinanceCategoriesModule } from './modules/finance-categories/finance-categories.module'
import { FinanceEntriesModule } from './modules/finance-entries/finance-entries.module'
import { MembersModule } from './modules/member/members.module'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    ConfigModule.forRoot(),
    UsersModule,
    MembersModule,
    FinanceCategoriesModule,
    FinanceEntriesModule,
    AnnouncementsModule,
    AgendaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
