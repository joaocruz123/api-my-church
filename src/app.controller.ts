import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from './modules/auth/decorators/public.decorator'
import { AppService } from './app.service'

@ApiTags('Health')
@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check da API' })
  @ApiOkResponse({ description: 'API online' })
  getHello(): string {
    return this.appService.getHello()
  }
}
