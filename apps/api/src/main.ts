import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ErrorStoreService } from './common/filters/error-store.service';
import { ApiErrorDbService } from './modules/monitoring/services/api-error-db.service';
import { ErrorGateway } from './modules/monitoring/error.gateway';
import helmet from 'helmet';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.use(helmet());

  // Defence-in-depth against payload-based DoS. The default NestJS body
  // parser is unbounded; we cap it at 2 MB for JSON and 1 MB for
  // url-encoded — more than enough for the transport/bus management API
  // (reservations, trips, agencies). Applied AFTER NestFactory.create() so
  // it overrides Nest's auto-installed parser; applied BEFORE globalPipes
  // so ValidationPipe can read the parsed body.
  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ limit: '1mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('OPEP API')
    .setDescription('Plateforme de Gestion de Transport Interurbain')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addServer(`http://localhost:${process.env.PORT || 3000}`, 'Développement local')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global exception filter — logs all errors, persists 5xx to DB, emits via WebSocket
  const httpAdapterHost = app.get(HttpAdapterHost);
  const errorStore = app.get(ErrorStoreService);
  const apiErrorDb = app.get(ApiErrorDbService);
  const errorGateway = app.get(ErrorGateway);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, errorStore, apiErrorDb, errorGateway));

  await app.listen(process.env.PORT || 3000);
  console.log(`Application démarrée sur http://localhost:${process.env.PORT || 3000}`);
  console.log(`Swagger UI: http://localhost:${process.env.PORT || 3000}/api/docs`);
}
bootstrap();
