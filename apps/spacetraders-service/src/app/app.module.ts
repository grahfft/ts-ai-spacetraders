import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsModule } from '@spacetraders/api-agents';
import { ContractsModule } from '@spacetraders/contracts-module';
import { Agent } from '@spacetraders/api-agents';
import { join } from 'path';
import { migrations } from '../migrations';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['POSTGRES_HOST'] ?? 'localhost',
      port: Number(process.env['POSTGRES_PORT'] ?? 5432),
      username: process.env['POSTGRES_USER'] ?? 'spacetraders',
      password: process.env['POSTGRES_PASSWORD'] ?? 'spacetraders',
      database: process.env['POSTGRES_DB'] ?? 'spacetraders',
      entities: [Agent],
      synchronize: false,
      migrations,
    }),
    AgentsModule,
    ContractsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
