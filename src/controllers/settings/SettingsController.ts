import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Project } from 'orm/entities/projects/Project';
import { TaskFlagTypes } from 'orm/entities/tasks/TaskFlagsTypes';
import { TaskPriorityTypes } from 'orm/entities/tasks/TaskPriorityTypes';
import { TaskStatusTypes } from 'orm/entities/tasks/TaskStatusTypes';
import { TaskTypeTypes } from 'orm/entities/tasks/TaskTypesTypes';

export class SettingsController {
  static async getAll(req: Request, res: Response) {
    try {
      const referer = req.headers.origin;
      let project_id: number | null = null;

      if (referer) {
        const projectRepository = getRepository(Project);
        const project = await projectRepository.findOne({ where: { url: referer } });
        if (project) {
          project_id = project.id;
        } else {
          return res.status(404).json({
            message: 'Проект не найден',
          });
        }
      }

      const typeRepository = getRepository(TaskTypeTypes);
      const statusRepository = getRepository(TaskStatusTypes);
      const priorityRepository = getRepository(TaskPriorityTypes);
      const flagRepository = getRepository(TaskFlagTypes);

      const [types, statuses, priorities, flags] = await Promise.all([
        typeRepository.find(),
        statusRepository.find(),
        priorityRepository.find(),
        flagRepository.find(),
      ]);

      return res.status(200).json({
        message: 'Настройки успешно получены',
        data: {
          project_id,
          types,
          statuses,
          priorities,
          flags,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Произошла ошибка при получении настроек',
        error: error.message,
      });
    }
  }
}
