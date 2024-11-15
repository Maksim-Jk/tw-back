import { MigrationInterface, QueryRunner } from 'typeorm';

export class new1731648770922 implements MigrationInterface {
  name = 'new1731648770922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "task_files"
            ADD "file_key" character varying NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "task_files" DROP COLUMN "file_key"
        `);
  }
}
