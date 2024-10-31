import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskPriorities1234567890003 implements MigrationInterface {
  name = 'CreateTaskPriorities1234567890003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "task_priorities" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "UQ_task_priorities_name" UNIQUE ("name"),
        CONSTRAINT "PK_task_priorities" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task_priorities"`);
  }
}
