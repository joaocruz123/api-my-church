import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { AgendaItem } from 'src/modules/agenda/entities/agenda-item.entity'
import { Announcement } from 'src/modules/announcements/entities/announcement.entity'
import { FinanceCategory } from 'src/modules/finance-categories/entities/finance-category.entity'
import { FinanceEntry } from 'src/modules/finance-entries/entities/finance-entry.entity'
import { Member } from 'src/modules/member/entities/member.entity'
import { User } from 'src/modules/users/entities/user.entity'
import { MemberEmailUnique1730000000000 } from 'src/migrations/1730000000000-MemberEmailUnique'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isProd = process.env.NODE_ENV === 'production'
    return {
      type: 'mysql',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_DATABASE'),
      synchronize: !isProd,
      migrationsRun: isProd,
      extra: {
        ssl: false,
      },
      logging: process.env.NODE_ENV !== 'production',
      entities: [
        User,
        Member,
        FinanceCategory,
        FinanceEntry,
        Announcement,
        AgendaItem,
      ],
      migrations: [MemberEmailUnique1730000000000],
    }
  }
}
