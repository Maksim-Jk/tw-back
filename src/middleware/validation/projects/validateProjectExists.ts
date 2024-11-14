import { param } from 'express-validator';
import { getRepository } from 'typeorm';

import { Project } from 'orm/entities/projects/Project';

export const validateProjectExists = [
  param().custom(async (_, { req }) => {
    const projectRepository = getRepository(Project);
    const project = await projectRepository.findOne({
      where: {
        url: req.headers.origin,
      },
    });

    if (!project) {
      throw new Error('Проект не найден');
    }

    req.project = project;
    return true;
  }),
];
