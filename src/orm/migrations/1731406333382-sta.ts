import { MigrationInterface, QueryRunner } from 'typeorm';

export class sta1731406333382 implements MigrationInterface {
  name = 'sta1731406333382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "username" character varying,
                "name" character varying,
                "role" character varying(30) NOT NULL DEFAULT 'STANDARD',
                "language" character varying(15) NOT NULL DEFAULT 'en-US',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "projects" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                "url" character varying,
                "logo" character varying,
                "repository" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "task_flags_types" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_9021efbd1c5e063f1a30f3bb667" UNIQUE ("name"),
                CONSTRAINT "PK_5ff56360307e98c3468e3079172" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "task_files" (
                "id" SERIAL NOT NULL,
                "filename" character varying NOT NULL,
                "original_name" character varying NOT NULL,
                "mime_type" character varying NOT NULL,
                "size" integer NOT NULL,
                "path" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "task_id" integer,
                "uploaded_by" integer,
                CONSTRAINT "PK_ef0155509609893f1c0cb9811a8" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "task_priorities_types" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_3b9a4ec04b4b717df61ccbc551b" UNIQUE ("name"),
                CONSTRAINT "PK_1206e75c6630e8caf2c6f309fa5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "task_statuses_types" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_b968c58f1aa4916dd7505c5b46f" UNIQUE ("name"),
                CONSTRAINT "PK_87f8d4b0066d70663c157eef438" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "task_types_types" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_32f0037517764b1b2d4f6a78288" UNIQUE ("name"),
                CONSTRAINT "PK_1800eca27b22f6219c8e8741008" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "description" text,
                "page_url" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "type_id" integer,
                "status_id" integer,
                "priority_id" integer,
                "project_id" integer,
                "created_by" integer,
                "updated_by" integer,
                CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user_projects" (
                "user_id" integer NOT NULL,
                "project_id" integer NOT NULL,
                CONSTRAINT "PK_f1cb6930858fc19acfac1ce4e54" PRIMARY KEY ("user_id", "project_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_86ef6061f6f13aa9252b12cbe8" ON "user_projects" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_4c6aaf014ba0d66a74bb552272" ON "user_projects" ("project_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "task_flags" (
                "task_id" integer NOT NULL,
                "flag_id" integer NOT NULL,
                CONSTRAINT "PK_c279889feae0197ec06ea2e24f2" PRIMARY KEY ("task_id", "flag_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_699eabec10299d9411b1c569a7" ON "task_flags" ("task_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_c7df6b6537286c1b31c9eb58cc" ON "task_flags" ("flag_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "task_files"
            ADD CONSTRAINT "FK_e302f4010ff50a1e8199a489090" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "task_files"
            ADD CONSTRAINT "FK_7dd79c6e53f19ff268f0a86d503" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks"
            ADD CONSTRAINT "FK_a3405e60f0cbc9980bd07eb4f72" FOREIGN KEY ("type_id") REFERENCES "task_types_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks"
            ADD CONSTRAINT "FK_e28288969fa7827bd12680cfe10" FOREIGN KEY ("status_id") REFERENCES "task_statuses_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks"
            ADD CONSTRAINT "FK_5d1c8f7898b5b84ad5ce08fcff8" FOREIGN KEY ("priority_id") REFERENCES "task_priorities_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks"
            ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks"
            ADD CONSTRAINT "FK_9fc727aef9e222ebd09dc8dac08" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks"
            ADD CONSTRAINT "FK_5d927ef9f86fac1f1671d093a04" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_projects"
            ADD CONSTRAINT "FK_86ef6061f6f13aa9252b12cbe87" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user_projects"
            ADD CONSTRAINT "FK_4c6aaf014ba0d66a74bb5522726" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "task_flags"
            ADD CONSTRAINT "FK_699eabec10299d9411b1c569a7e" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "task_flags"
            ADD CONSTRAINT "FK_c7df6b6537286c1b31c9eb58cc5" FOREIGN KEY ("flag_id") REFERENCES "task_flags_types"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "task_flags" DROP CONSTRAINT "FK_c7df6b6537286c1b31c9eb58cc5"
        `);
    await queryRunner.query(`
            ALTER TABLE "task_flags" DROP CONSTRAINT "FK_699eabec10299d9411b1c569a7e"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_projects" DROP CONSTRAINT "FK_4c6aaf014ba0d66a74bb5522726"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_projects" DROP CONSTRAINT "FK_86ef6061f6f13aa9252b12cbe87"
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks" DROP CONSTRAINT "FK_5d927ef9f86fac1f1671d093a04"
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks" DROP CONSTRAINT "FK_9fc727aef9e222ebd09dc8dac08"
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks" DROP CONSTRAINT "FK_5d1c8f7898b5b84ad5ce08fcff8"
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks" DROP CONSTRAINT "FK_e28288969fa7827bd12680cfe10"
        `);
    await queryRunner.query(`
            ALTER TABLE "tasks" DROP CONSTRAINT "FK_a3405e60f0cbc9980bd07eb4f72"
        `);
    await queryRunner.query(`
            ALTER TABLE "task_files" DROP CONSTRAINT "FK_7dd79c6e53f19ff268f0a86d503"
        `);
    await queryRunner.query(`
            ALTER TABLE "task_files" DROP CONSTRAINT "FK_e302f4010ff50a1e8199a489090"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_c7df6b6537286c1b31c9eb58cc"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_699eabec10299d9411b1c569a7"
        `);
    await queryRunner.query(`
            DROP TABLE "task_flags"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_4c6aaf014ba0d66a74bb552272"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_86ef6061f6f13aa9252b12cbe8"
        `);
    await queryRunner.query(`
            DROP TABLE "user_projects"
        `);
    await queryRunner.query(`
            DROP TABLE "tasks"
        `);
    await queryRunner.query(`
            DROP TABLE "task_types_types"
        `);
    await queryRunner.query(`
            DROP TABLE "task_statuses_types"
        `);
    await queryRunner.query(`
            DROP TABLE "task_priorities_types"
        `);
    await queryRunner.query(`
            DROP TABLE "task_files"
        `);
    await queryRunner.query(`
            DROP TABLE "task_flags_types"
        `);
    await queryRunner.query(`
            DROP TABLE "projects"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
