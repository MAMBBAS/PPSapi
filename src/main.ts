import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Устанавливаем глобальный префикс
  app.setGlobalPrefix('api');
  
  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('PPS')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('auth') // Добавляем теги для группировки эндпоинтов
    .addTag('users')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header'
      },
      'JWT-auth'
    )
    .addBasicAuth()
    .build();
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет поля не описанные в DTO
      forbidNonWhitelisted: true, // Бросает ошибку при наличии лишних полей
      transform: true, // Автоматически преобразует типы данных
    })
  );
  
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  
  // Создаем документ с учетом глобального префикса
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false, // Учитываем глобальный префикс
  });
  
  // Настраиваем путь к Swagger UI (/api/docs)
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT ?? 5200);
}
bootstrap();
