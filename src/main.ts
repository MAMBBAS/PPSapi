import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Устанавливаем глобальный префикс
  app.setGlobalPrefix('api');
  
  // Настройка Swagger
  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('auth') // Добавляем теги для группировки эндпоинтов
    .addTag('users')
    .addBearerAuth() // Добавляем поддержку JWT аутентификации
    .build();
  
  // Создаем документ с учетом глобального префикса
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false, // Учитываем глобальный префикс
  });
  
  // Настраиваем путь к Swagger UI (/api/docs)
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT ?? 4200);
}
bootstrap();
