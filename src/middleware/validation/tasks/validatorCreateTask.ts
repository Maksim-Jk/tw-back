import { body } from 'express-validator';

export const validatorCreateTask = [
  body('title')
    .notEmpty()
    .withMessage('Название задачи обязательно')
    .isLength({ min: 3, max: 255 })
    .withMessage('Название должно быть от 3 до 255 символов'),
  body('description').isLength({ max: 10000 }).withMessage('Описание не должно превышать 10000 символов'),
  body('page_url').notEmpty().withMessage('Некорректный URL'),
  body('type_id').isInt().withMessage('Некорректный тип задачи'),
  body('priority_id').isInt().withMessage('Некорректный приоритет задачи'),
  body('flag_ids').optional().isArray().withMessage('Некорректный флаг задачи'),
];
