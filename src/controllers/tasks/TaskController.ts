import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Project } from 'orm/entities/projects/Project';
import { Task } from 'orm/entities/tasks/Task';
import { TaskFlagTypes } from 'orm/entities/tasks/TaskFlagsTypes';
import { TaskPriorityTypes } from 'orm/entities/tasks/TaskPriorityTypes';
import { TaskStatusTypes } from 'orm/entities/tasks/TaskStatusTypes';
import { TaskTypeTypes } from 'orm/entities/tasks/TaskTypesTypes';
import { User } from 'orm/entities/users/User';

export class TaskController {
  static async create(req: Request, res: Response) {
    try {
      const { title, description, page_url, type_id, priority_id, flag_ids, project_id } = req.body;

      const task = new Task();
      task.title = title;
      task.description = description;
      task.page_url = page_url;
      task.createdBy = req.jwtPayload as User;
      task.updatedBy = req.jwtPayload as User;
      task.status = { id: 1 } as TaskStatusTypes;

      if (type_id) task.type = { id: type_id } as TaskTypeTypes;
      if (priority_id) task.priority = { id: priority_id } as TaskPriorityTypes;
      if (flag_ids && Array.isArray(flag_ids)) {
        task.flags = flag_ids.map((id) => ({ id } as TaskFlagTypes));
      }
      if (project_id) task.project = { id: project_id } as Project;

      const taskRepository = getRepository(Task);
      await taskRepository.save(task);

      return res.status(201).json({
        message: 'Задача успешно создана',
        task,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Произошла ошибка при создании задачи',
        error: error.message,
      });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const taskRepository = getRepository(Task);
      const typeId = req.query.type_id;

      const whereClause = typeId ? `WHERE t.type_id = ${typeId}` : '';

      const tasks = await taskRepository.query(`
        SELECT 
          t.*,
          COALESCE(ARRAY_AGG(tf.flag_id) FILTER (WHERE tf.flag_id IS NOT NULL), ARRAY[]::integer[]) as flag_ids
        FROM tasks t
        LEFT JOIN task_flags tf ON t.id = tf.task_id
        ${whereClause}
        GROUP BY t.id
        ORDER BY t.created_at DESC
      `);

      return res.customSuccess(200, 'Tasks successfully fetched.', tasks);
    } catch (error) {
      return res.status(500).json({
        message: 'Произошла ошибка при получении задач',
        error: error.message,
      });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const taskRepository = getRepository(Task);

      const task = await taskRepository.query(`SELECT * FROM tasks WHERE id = ${id}`);

      if (!task) {
        return res.status(404).json({
          message: 'Задача не найдена',
        });
      }

      return res.customSuccess(200, 'Task successfully fetched.', ...task);
    } catch (error) {
      return res.status(500).json({
        message: 'Произошла ошибка при получении задачи',
        error: error.message,
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { title, description, page_url, type_id, status_id, priority_id, flag_ids, project_id } = req.body;

      const taskRepository = getRepository(Task);
      const task = await taskRepository.findOne({ where: { id } });

      if (!task) {
        return res.status(404).json({
          message: 'Задача не найдена',
        });
      }

      task.title = title || task.title;
      task.description = description || task.description;
      task.page_url = page_url || task.page_url;
      task.updatedBy = req.jwtPayload as User;

      if (type_id) task.type = { id: type_id } as TaskTypeTypes;
      if (status_id) task.status = { id: status_id } as TaskStatusTypes;
      if (priority_id) task.priority = { id: priority_id } as TaskPriorityTypes;
      if (flag_ids && Array.isArray(flag_ids)) {
        task.flags = flag_ids.map((id) => ({ id } as TaskFlagTypes));
      }
      if (project_id) task.project = { id: project_id } as Project;

      await taskRepository.save(task);

      return res.json({
        message: 'Задача успешно обновлена',
        task,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Произошла ошибка при обновлении задачи',
        error: error.message,
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const taskRepository = getRepository(Task);

      const task = await taskRepository.findOne({ where: { id } });

      if (!task) {
        return res.status(404).json({
          message: 'Задача не найдена',
        });
      }

      await taskRepository.remove(task);

      return res.json({
        message: 'Задача успешно удалена',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Произошла ошибка при удалении задачи',
        error: error.message,
      });
    }
  }
}
