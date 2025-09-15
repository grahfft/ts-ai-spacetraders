/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { config as loadEnv } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext, addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // Load environment variables from .env.local if present, otherwise .env
  const envLocalPath = resolve(process.cwd(), '.env.local');
  if (existsSync(envLocalPath)) {
    loadEnv({ path: envLocalPath });
  } else {
    loadEnv();
  }
  // Initialize CLS namespace BEFORE Nest app creation so @Transactional() works during module instantiation
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  // Register TypeORM DataSource with transactional context
  const dataSource = app.get(DataSource);
  addTransactionalDataSource(dataSource);
  const corsOrigins = (process.env['CORS_ORIGINS'] || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : [
      /^(http|https):\/\/localhost(?::\d+)?$/,
      /^(http|https):\/\/127\.0\.0\.1(?::\d+)?$/
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  // Swagger
  const swaggerCfg = new DocumentBuilder()
    .setTitle('SpaceTraders Service API')
    .setDescription('Backend proxy endpoints for SpaceTraders')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, swaggerCfg);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, doc);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
