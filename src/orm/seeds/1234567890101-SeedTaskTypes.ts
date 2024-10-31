import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { TaskType, TaskTypeEnum } from 'orm/entities/tasks/TaskType';

export class SeedTaskTypes1234567890101 implements MigrationInterface {
  name = 'SeedTaskTypes1234567890101';
  
  public async up(queryRunner: QueryRunner): Promise<void> {
    const taskTypeRepository = getRepository(TaskType);

    let taskType = new TaskType();
    taskType.name = TaskTypeEnum.TASK;
    await taskTypeRepository.save(taskType);

    taskType = new TaskType();
    taskType.name = TaskTypeEnum.QUESTION;
    await taskTypeRepository.save(taskType);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const taskTypeRepository = getRepository(TaskType);
    await taskTypeRepository.clear();
  }
}
