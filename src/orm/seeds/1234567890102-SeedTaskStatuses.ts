import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { TaskStatus, TaskStatusEnum } from 'orm/entities/tasks/TaskStatus';

export class SeedTaskStatuses1234567890102 implements MigrationInterface {
  name = 'SeedTaskStatuses1234567890102';
  public async up(queryRunner: QueryRunner): Promise<void> {
    const statusRepository = getRepository(TaskStatus);

    const statuses = [
      TaskStatusEnum.COMPLETED,
      TaskStatusEnum.IN_PROGRESS,
      TaskStatusEnum.CREATED,
      TaskStatusEnum.ARCHIVED
    ];

    for (const statusName of statuses) {
      const status = new TaskStatus();
      status.name = statusName;
      await statusRepository.save(status);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const statusRepository = getRepository(TaskStatus);
    await statusRepository.clear();
  }
}
