import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { TaskFlag, TaskFlagEnum } from 'orm/entities/tasks/TaskFlag';

export class SeedTaskFlags1234567890103 implements MigrationInterface {
  name = 'SeedTaskFlags1234567890103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const taskFlagRepository = getRepository(TaskFlag);

    const flags = [TaskFlagEnum.URGENT, TaskFlagEnum.IMPORTANT, TaskFlagEnum.NORMAL, TaskFlagEnum.LOW_PRIORITY];

    for (const flagName of flags) {
      const flag = new TaskFlag();
      flag.name = flagName;
      await taskFlagRepository.save(flag);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const taskFlagRepository = getRepository(TaskFlag);
    await taskFlagRepository.clear();
  }
}
