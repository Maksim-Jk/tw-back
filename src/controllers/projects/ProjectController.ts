import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Project } from 'orm/entities/projects/Project';
import { User } from 'orm/entities/users/User';

export class ProjectController {
  static async create(req: Request, res: Response) {
    try {
      const { name, description, url, logo, repository } = req.body;

      const project = new Project();
      project.name = name;
      project.description = description;
      project.url = url;
      project.logo = logo;
      project.repository = repository;

      // Добавляем создателя проекта как участника
      project.users = [req.jwtPayload as User];

      const projectRepository = getRepository(Project);
      await projectRepository.save(project);

      return res.status(201).json({
        message: 'Проект успешно создан',
        project,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Произошла ошибка при создании проекта',
        error: error.message,
      });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const projectRepository = getRepository(Project);
      const projects = await projectRepository.query(
        `SELECT * FROM projects WHERE id IN (SELECT project_id FROM user_projects WHERE user_id = ${req.jwtPayload.id})`,
      );

      return res.json(projects);
    } catch (error) {
      return res.status(500).json({
        message: 'Произошла ошибка при получении проектов',
        error: error.message,
      });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const projectRepository = getRepository(Project);

      const project = await projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.users', 'user')
        .where('project.id = :id', { id })
        .andWhere('user.id = :userId', { userId: req.jwtPayload.id })
        .getOne();

      if (!project) {
        return res.status(404).json({
          message: 'Проект не найден',
        });
      }

      return res.json(project);
    } catch (error) {
      return res.status(500).json({
        message: 'Произошла ошибка при получении проекта',
        error: error.message,
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { name, description, url, logo, repository } = req.body;

      const projectRepository = getRepository(Project);
      const project = await projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.users', 'user')
        .where('project.id = :id', { id })
        .andWhere('user.id = :userId', { userId: req.jwtPayload.id })
        .getOne();

      if (!project) {
        return res.status(404).json({
          message: 'Проект не найден',
        });
      }

      project.name = name || project.name;
      project.description = description || project.description;
      project.url = url || project.url;
      project.logo = logo || project.logo;
      project.repository = repository || project.repository;

      await projectRepository.save(project);

      return res.json({
        message: 'Проект успешно обновлен',
        project,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Произошла ошибка при обновлении проекта',
        error: error.message,
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const projectRepository = getRepository(Project);

      const project = await projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.users', 'user')
        .where('project.id = :id', { id })
        .andWhere('user.id = :userId', { userId: req.jwtPayload.id })
        .getOne();

      if (!project) {
        return res.status(404).json({
          message: 'Проект не найден',
        });
      }

      await projectRepository.remove(project);

      return res.json({
        message: 'Проект успешно удален',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Произошла ошибка при удалении проекта',
        error: error.message,
      });
    }
  }
}
