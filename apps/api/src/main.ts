import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
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

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
