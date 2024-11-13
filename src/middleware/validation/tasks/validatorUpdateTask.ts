import { body } from 'express-validator';

export const validatorUpdateTask = [
  body('title').optional().isLength({ min: 3, max: 255 }).withMessage('Название должно быть от 3 до 255 символов'),
  body('description').optional().isLength({ max: 10000 }).withMessage('Описание не должно превышать 10000 символов'),
  body('page_url').optional().isURL().withMessage('Некорректный URL'),
  body('type_id').optional().isInt().withMessage('Некорректный тип задачи'),
  body('status_id').optional().isInt().withMessage('Некорректный статус задачи'),
  body('priority_id').optional().isInt().withMessage('Некорректный приоритет задачи'),
  body('flag_ids').optional().isArray().withMessage('Некорректный флаг задачи'),
  body('project_id').optional().isInt().withMessage('Некорректный проект'),
  body('updated_by').optional().isInt().withMessage('Некорректный ID редактора задачи'),
];
