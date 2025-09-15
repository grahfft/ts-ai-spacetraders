import { MigrationInterface, QueryRunner } from "typeorm";

export class DropAccountTokenHash1737020000000 implements MigrationInterface {
  name = 'DropAccountTokenHash1737020000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // agents table may already not have the column; use IF EXISTS for safety
    await queryRunner.query('ALTER TABLE "agents" DROP COLUMN IF EXISTS "accountTokenHash"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "accountTokenHash" varchar(64)');
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_agents_accountTokenHash" ON "agents" ("accountTokenHash")');
  }
}
