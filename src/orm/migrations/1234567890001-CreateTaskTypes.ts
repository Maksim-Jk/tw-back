import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskTypes1234567890001 implements MigrationInterface {
  name = 'CreateTaskTypes1234567890001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "task_types" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "UQ_task_types_name" UNIQUE ("name"),
        CONSTRAINT "PK_task_types" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task_types"`);
  }
} 