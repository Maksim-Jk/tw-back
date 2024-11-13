import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { TaskTypeTypes, TaskTypeEnum } from 'orm/entities/tasks/TaskTypesTypes';

export class SeedTaskTypes1234567890101 implements MigrationInterface {
  name = 'SeedTaskTypes1234567890101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const taskTypeRepository = getRepository(TaskTypeTypes);

    let taskType = new TaskTypeTypes();
    taskType.name = TaskTypeEnum.TASK;
    await taskTypeRepository.save(taskType);

    taskType = new TaskTypeTypes();
    taskType.name = TaskTypeEnum.QUESTION;
    await taskTypeRepository.save(taskType);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const taskTypeRepository = getRepository(TaskTypeTypes);
    await taskTypeRepository.clear();
  }
}
