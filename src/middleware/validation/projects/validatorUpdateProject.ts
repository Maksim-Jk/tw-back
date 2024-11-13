import { body } from 'express-validator';

export const validatorUpdateProject = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Название проекта должно быть от 2 до 100 символов'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Описание проекта не должно превышать 500 символов'),
  body('url').optional().isURL().withMessage('Некорректный URL проекта'),
  body('repository').optional().isURL().withMessage('Некорректный URL репозитория'),
];
