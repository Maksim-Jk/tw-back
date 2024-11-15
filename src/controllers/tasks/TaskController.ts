import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Project } from 'orm/entities/projects/Project';
import { Task } from 'orm/entities/tasks/Task';
import { TaskFile } from 'orm/entities/tasks/TaskFile';
import { TaskFlagTypes } from 'orm/entities/tasks/TaskFlagsTypes';
import { TaskPriorityTypes } from 'orm/entities/tasks/TaskPriorityTypes';
import { TaskStatusTypes } from 'orm/entities/tasks/TaskStatusTypes';
import { TaskTypeTypes } from 'orm/entities/tasks/TaskTypesTypes';
import { User } from 'orm/entities/users/User';
import { S3Service } from 'services/S3Service';

export class TaskController {
  static async testUpload(req: Request, res: Response) {
    const s3Service = S3Service.getInstance();
    const isConnected = await s3Service.checkConnection();
    if (!isConnected) {
      console.error('Нет подключения к S3');
    }

    // try {
    //   console.log('testUpload started');

    //   if (!req.file) {
    //     return res.status(400).json({ message: 'Файл не найден' });
    //   }

    //   const file = req.file;
    //   console.log('Processing file:', file.originalname);

    //   const s3Service = S3Service.getInstance();
    //   console.log('S3 service initialized');

    //   const { fileUrl, fileKey } = await s3Service.uploadFile(file, 'tasks').catch((error) => {
    //     console.error('S3 upload error:', error);
    //     throw error;
    //   });

    //   console.log('File uploaded successfully:', { fileUrl, fileKey });

    //   return res.json({ fileUrl, fileKey });
    // } catch (error) {
    //   console.error('Error in testUpload:', error);
    //   return res.status(500).json({
    //     message: 'Произошла ошибка при загрузке файла',
    //     error: error.message,
    //   });
    // }
  }

  static async create(req: Request, res: Response) {
    try {
      const { title, description, page_url, type_id, priority_id, flag_ids, project_id } = req.body;
      const file = req.file;

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

      if (file) {
        const s3Service = S3Service.getInstance();
        const { fileUrl, fileKey } = await s3Service.uploadFile(file, 'tasks');

        const taskFile = new TaskFile();
        taskFile.path = fileUrl;
        taskFile.fileKey = fileKey;
        taskFile.filename = file.originalname;
        taskFile.originalName = file.originalname;
        taskFile.mimeType = file.mimetype;
        taskFile.size = file.size;
        taskFile.uploadedBy = req.jwtPayload as User;
        taskFile.task = task;

        const taskFileRepository = getRepository(TaskFile);
        await taskFileRepository.save(taskFile);
      }

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
      const search = req.query.search as string;
      const dateFrom = req.query.date_from as string;
      const dateTo = req.query.date_to as string;
      const priorityId = req.query.priority_id;
      const statusId = req.query.status_id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const whereConditions = [];
      if (typeId) whereConditions.push(`t.type_id = ${typeId}`);
      if (search) whereConditions.push(`t.title ILIKE '%${search}%'`);
      if (priorityId) whereConditions.push(`t.priority_id = ${priorityId}`);
      if (statusId) whereConditions.push(`t.status_id = ${statusId}`);
      if (dateFrom) whereConditions.push(`DATE(t.created_at) >= DATE('${dateFrom}')`);
      if (dateTo) whereConditions.push(`DATE(t.created_at) <= DATE('${dateTo}')`);

      const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : '';

      const totalCount = await taskRepository.query(`
        SELECT COUNT(*) as count
        FROM tasks t
        ${whereClause}
      `);

      const tasks = await taskRepository.query(`
        SELECT 
          t.*,
          COALESCE(ARRAY_AGG(tf.flag_id) FILTER (WHERE tf.flag_id IS NOT NULL), ARRAY[]::integer[]) as flag_ids
        FROM tasks t
        LEFT JOIN task_flags tf ON t.id = tf.task_id
        ${whereClause}
        GROUP BY t.id
        ORDER BY t.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `);

      return res.customSuccess(200, 'Tasks successfully fetched.', {
        items: tasks,
        total: parseInt(totalCount[0].count),
        page,
        limit,
        totalPages: Math.ceil(parseInt(totalCount[0].count) / limit),
      });
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

  // static async update(req: Request, res: Response) {
  //   try {
  //     const id = req.params.id;
  //     const { title, description, page_url, type_id, status_id, priority_id, flag_ids, project_id } = req.body;
  //     const file = req.file;

  //     const taskRepository = getRepository(Task);
  //     const task = await taskRepository.findOne({ where: { id } });

  //     if (!task) {
  //       return res.status(404).json({
  //         message: 'Задача не найдена',
  //       });
  //     }

  //     if (file && task.fileKey) {
  //       const s3Service = S3Service.getInstance();
  //       await s3Service.deleteFile(task.fileKey);
  //     }

  //     if (file) {
  //       const s3Service = S3Service.getInstance();
  //       const { fileUrl, fileKey } = await s3Service.uploadFile(file, 'tasks');

  //       const taskFile = new TaskFile();
  //       taskFile.path = fileUrl;
  //       taskFile.fileKey = fileKey;
  //       taskFile.filename = fileUrl.split('/').pop() || file.originalname;
  //       taskFile.originalName = file.originalname;
  //       taskFile.mimeType = file.mimetype;
  //       taskFile.size = file.size;
  //       taskFile.uploadedBy = req.jwtPayload as User;
  //       taskFile.task = task;

  //       const taskFileRepository = getRepository(TaskFile);
  //       await taskFileRepository.save(taskFile);
  //     }

  //     task.title = title || task.title;
  //     task.description = description || task.description;
  //     task.page_url = page_url || task.page_url;
  //     task.updatedBy = req.jwtPayload as User;

  //     if (type_id) task.type = { id: type_id } as TaskTypeTypes;
  //     if (status_id) task.status = { id: status_id } as TaskStatusTypes;
  //     if (priority_id) task.priority = { id: priority_id } as TaskPriorityTypes;
  //     if (flag_ids && Array.isArray(flag_ids)) {
  //       task.flags = flag_ids.map((id) => ({ id } as TaskFlagTypes));
  //     }
  //     if (project_id) task.project = { id: project_id } as Project;

  //     await taskRepository.save(task);

  //     return res.json({
  //       message: 'Задача успешно обновлена',
  //       task,
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       message: 'Произошла ошибка при обновлении задачи',
  //       error: error.message,
  //     });
  //   }
  // }

  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const taskRepository = getRepository(Task);
      await taskRepository.delete(id);

      res.status(200).json({ message: 'Задача успешно удалена' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при удалении задачи' });
    }
  }

  static async deleteMany(req: Request, res: Response) {
    try {
      const { ids } = req.body;
      const taskRepository = getRepository(Task);

      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: 'Неверный формат данных' });
      }

      await taskRepository.delete(ids);

      return res.status(200).json({ message: 'Задачи успешно удалены' });
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при удалении задач' });
    }
  }
}
