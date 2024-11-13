import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { TaskStatusTypes, TaskStatusEnum } from 'orm/entities/tasks/TaskStatusTypes';

export class SeedTaskStatuses1234567890102 implements MigrationInterface {
  name = 'SeedTaskStatuses1234567890102';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const statusRepository = getRepository(TaskStatusTypes);

    for (const statusName of Object.values(TaskStatusEnum)) {
      const status = new TaskStatusTypes();
      status.name = statusName;
      await statusRepository.save(status);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const statusRepository = getRepository(TaskStatusTypes);
    await statusRepository.clear();
  }
}
