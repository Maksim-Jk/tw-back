import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskStatuses1234567890002 implements MigrationInterface {
  name = 'CreateTaskStatuses1234567890002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "task_statuses" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "UQ_task_statuses_name" UNIQUE ("name"),
        CONSTRAINT "PK_task_statuses" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task_statuses"`);
  }
}
