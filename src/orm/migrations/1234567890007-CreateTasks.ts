import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasks1234567890007 implements MigrationInterface {
  name = 'CreateTasks1234567890007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" text,
        "page_url" character varying,
        "type_id" integer,
        "status_id" integer,
        "priority_id" integer,
        "flag_id" integer,
        "project_id" integer,
        "created_by" integer,
        "updated_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tasks" PRIMARY KEY ("id"),
        CONSTRAINT "FK_task_type" FOREIGN KEY ("type_id") REFERENCES "task_types"("id"),
        CONSTRAINT "FK_task_status" FOREIGN KEY ("status_id") REFERENCES "task_statuses"("id"),
        CONSTRAINT "FK_task_priority" FOREIGN KEY ("priority_id") REFERENCES "task_priorities"("id"),
        CONSTRAINT "FK_task_flag" FOREIGN KEY ("flag_id") REFERENCES "task_flags"("id"),
        CONSTRAINT "FK_task_project" FOREIGN KEY ("project_id") REFERENCES "projects"("id"),
        CONSTRAINT "FK_task_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id"),
        CONSTRAINT "FK_task_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users"("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tasks"`);
  }
}
