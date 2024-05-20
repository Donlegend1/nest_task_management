import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ["http://localhost:8000", "add other frontend url"],
    credentials:true
  });

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API for managing tasks and users')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  console.log('=====Load the URL to see documentation====================');
  console.log('http://localhost:3000/api-docs');
  console.log('====================================');

  await app.listen(3000);
}
bootstrap();
