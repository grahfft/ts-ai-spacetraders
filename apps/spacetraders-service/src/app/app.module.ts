import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AgentsModule } from '@spacetraders/api-agents';
import { Agent } from '@spacetraders/api-agents';

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
      synchronize: true,
    }),
    AgentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
