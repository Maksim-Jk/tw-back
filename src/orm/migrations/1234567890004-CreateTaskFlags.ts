import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskFlags1234567890004 implements MigrationInterface {
  name = 'CreateTaskFlags1234567890004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "task_flags" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "UQ_task_flags_name" UNIQUE ("name"),
        CONSTRAINT "PK_task_flags" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task_flags"`);
  }
}
