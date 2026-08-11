import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://127.0.0.1:3001',
    ],
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('myChurch API')
    .setDescription('API NestJS do myChurch — gestão eclesiástica')
    .setVersion('1.0')
    .addTag('Health', 'Health check')
    .addTag('Users', 'Gestão de usuários')
    .addTag('Members', 'Gestão de membros')
    .addTag('Finance Categories', 'Categorias financeiras')
    .addTag('Finance Entries', 'Lançamentos financeiros')
    .addTag('Announcements', 'Mural de avisos')
    .addTag('Agenda', 'Agenda da igreja')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
