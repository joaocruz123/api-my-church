import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { hashPassword } from '../../../common/utils/password.util'
import { User } from '../../users/entities/user.entity'

@Injectable()
export class SeedAdminService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedAdminService.name)

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.userRepo.count()
    if (count > 0) return

    const email =
      this.configService.get<string>('ADMIN_EMAIL') ?? 'admin@mychurch.local'
    const password =
      this.configService.get<string>('ADMIN_PASSWORD') ?? 'admin123'
    const name =
      this.configService.get<string>('ADMIN_NAME') ?? 'Administrador'

    const admin = new User({
      name,
      email,
      password: await hashPassword(password),
      role: 'admin',
      status: true,
    })

    await this.userRepo.save(admin)
    this.logger.log(`Usuário admin inicial criado: ${email}`)
  }
}
