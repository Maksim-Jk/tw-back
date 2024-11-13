import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { TaskFlagTypes, TaskFlagEnum } from 'orm/entities/tasks/TaskFlagsTypes';

export class SeedTaskFlags1234567890103 implements MigrationInterface {
  name = 'SeedTaskFlags1234567890103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const taskFlagRepository = getRepository(TaskFlagTypes);

    const flags = [TaskFlagEnum.URGENT, TaskFlagEnum.IMPORTANT, TaskFlagEnum.NORMAL, TaskFlagEnum.LOW_PRIORITY];

    for (const flagName of flags) {
      const flag = new TaskFlagTypes();
      flag.name = flagName;
      await taskFlagRepository.save(flag);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const taskFlagRepository = getRepository(TaskFlagTypes);
    await taskFlagRepository.clear();
  }
}
