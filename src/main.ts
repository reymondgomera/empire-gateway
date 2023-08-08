import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api/')
  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder().setTitle('Gateway').setDescription('Gateway Service API').setVersion('0.1').build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/api/docs', app, document)

  app.enableCors()
  const PORT = process.env.PORT || 4000
  await app.listen(PORT)
}

bootstrap()
