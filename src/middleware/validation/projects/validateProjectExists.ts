import { param } from 'express-validator';
import { getRepository } from 'typeorm';

import { Project } from 'orm/entities/projects/Project';

export const validateProjectExists = [
  param('id').custom(async (id, { req }) => {
    console.log(req.headers.origin);

    const projectRepository = getRepository(Project);
    const project = await projectRepository.findOne({
      where: {
        id,
        url: req.headers.origin,
      },
    });

    console.log(project);

    if (!project) {
      throw new Error('Проект не найден');
    }
    return true;
  }),
];
