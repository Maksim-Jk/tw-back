import { Router } from 'express';

import { checkJwt } from 'middleware/checkJwt';
import { checkValidation } from 'middleware/validation/checkValidation';
import { validatorCreateTask } from 'middleware/validation/tasks/validatorCreateTask';
import { validatorUpdateTask } from 'middleware/validation/tasks/validatorUpdateTask';

import { TaskController } from '../../controllers/tasks/TaskController';

const router = Router();

// Создание задачи
router.post('/', [checkJwt, ...validatorCreateTask, checkValidation], TaskController.create);

// Получение всех задач
router.get('/', [checkJwt], TaskController.getAll);

// Получение одной задачи по ID
router.get('/:id', [checkJwt], TaskController.getOne);

// Обновление задачи
router.put('/:id', [checkJwt, ...validatorUpdateTask, checkValidation], TaskController.update);

// Удаление задачи
router.delete('/:id', [checkJwt], TaskController.delete);

export default router;
