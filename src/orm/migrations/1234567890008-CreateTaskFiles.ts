import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskFiles1234567890008 implements MigrationInterface {
  name = 'CreateTaskFiles1234567890008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "task_files" (
        "id" SERIAL NOT NULL,
        "filename" character varying NOT NULL,
        "originalName" character varying NOT NULL,
        "mimeType" character varying NOT NULL,
        "size" integer NOT NULL,
        "path" character varying NOT NULL,
        "task_id" integer,
        "uploaded_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_task_files" PRIMARY KEY ("id"),
        CONSTRAINT "FK_task_files_task" FOREIGN KEY ("task_id") REFERENCES "tasks"("id"),
        CONSTRAINT "FK_task_files_user" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task_files"`);
  }
}
