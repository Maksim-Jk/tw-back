import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { TaskPriorityEnum, TaskPriorityTypes } from 'orm/entities/tasks/TaskPriorityTypes';

export class SeedTaskPriorities1234567890105 implements MigrationInterface {
  name = 'SeedTaskPriorities1234567890105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const taskPriorityRepository = getRepository(TaskPriorityTypes);

    // Создаем массив приоритетов из enum
    const priorities = Object.values(TaskPriorityEnum);

    // Сохраняем каждый приоритет в базу данных
    for (const priorityName of priorities) {
      const taskPriority = new TaskPriorityTypes();
      taskPriority.name = priorityName;
      await taskPriorityRepository.save(taskPriority);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const taskPriorityRepository = getRepository(TaskPriorityTypes);
    await taskPriorityRepository.clear();
  }
}
