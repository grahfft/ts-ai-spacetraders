/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { config as loadEnv } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // Load environment variables from .env.local if present, otherwise .env
  const envLocalPath = resolve(process.cwd(), '.env.local');
  if (existsSync(envLocalPath)) {
    loadEnv({ path: envLocalPath });
  } else {
    loadEnv();
  }
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      /^(http|https):\/\/localhost(?::\d+)?$/,
      /^(http|https):\/\/127\.0\.0\.1(?::\d+)?$/
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
