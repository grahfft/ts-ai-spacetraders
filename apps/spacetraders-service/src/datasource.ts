import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { migrations } from './migrations';

// Load env the same way as main.ts
const envLocalPath = resolve(process.cwd(), '.env.local');
if (existsSync(envLocalPath)) {
  loadEnv({ path: envLocalPath });
} else {
  loadEnv();
}

export const ds = new DataSource({
  type: 'postgres',
  host: process.env['POSTGRES_HOST'] ?? 'localhost',
  port: Number(process.env['POSTGRES_PORT'] ?? 5432),
  username: process.env['POSTGRES_USER'] ?? 'spacetraders',
  password: process.env['POSTGRES_PASSWORD'] ?? 'spacetraders',
  database: process.env['POSTGRES_DB'] ?? 'spacetraders',
  // No entities required to run SQL migrations
  entities: [],
  migrations,
});


