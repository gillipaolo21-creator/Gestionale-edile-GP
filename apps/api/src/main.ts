import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Abilitiamo il CORS per permettere al frontend di comunicare con il backend
  app.enableCors();

  // Validazione rigorosa: trasformiamo i tipi e puliamo i campi extra
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Spostiamo sulla porta 3001 per evitare conflitti con Next.js
  await app.listen(3001);
  console.log(`Backend attivo su: http://localhost:3001`);
}
bootstrap();