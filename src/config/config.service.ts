import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { AgendaItem } from 'src/modules/agenda/entities/agenda-item.entity'
import { Announcement } from 'src/modules/announcements/entities/announcement.entity'
import { FinanceCategory } from 'src/modules/finance-categories/entities/finance-category.entity'
import { FinanceEntry } from 'src/modules/finance-entries/entities/finance-entry.entity'
import { Member } from 'src/modules/member/entities/member.entity'
import { User } from 'src/modules/users/entities/user.entity'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_DATABASE'),
      synchronize: true,
      extra: {
        ssl: false,
      },
      logging: true,
      entities: [
        User,
        Member,
        FinanceCategory,
        FinanceEntry,
        Announcement,
        AgendaItem,
      ],
      migrations: [],
    }
  }
}
