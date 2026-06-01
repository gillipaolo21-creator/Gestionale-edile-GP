import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  let app: Awaited<ReturnType<typeof NestFactory.create>>;

  try {
    app = await NestFactory.create(AppModule, { bufferLogs: true });
  } catch (err: unknown) {
    const logger = new Logger('Bootstrap');
    const message = err instanceof Error ? err.message : String(err);
    logger.error('Impossibile avviare il server — configurazione non valida:\n' + message);
    logger.error('Assicurati che il file .env contenga: DATABASE_URL, JWT_SECRET, FRONTEND_URL, STORAGE_BASE_PATH');
    process.exit(1);
  }

  const logger = new Logger('Bootstrap');

  // Filtro globale per gestire tutti gli errori in modo uniforme
  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS: accetta solo richieste dal frontend configurato
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  // Validazione rigorosa: trasformiamo i tipi e puliamo i campi extra
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger API Documentation (solo in sviluppo)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Gestionale Edile GP — API')
      .setDescription('API REST per la gestione di commesse, documenti, forniture, SAL e fatture.')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    logger.log('Swagger disponibile su: http://localhost:3001/api/docs');
  }

  const port = Number.parseInt(process.env.API_PORT ?? '3001', 10);
  const host = process.env.API_HOST ?? '0.0.0.0';
  await app.listen(port, host);
  logger.log(`Backend attivo su: http://${host}:${port}`);
}
bootstrap();

