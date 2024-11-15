import { Router } from 'express';
import multer from 'multer';

import { checkJwt } from 'middleware/checkJwt';
import { checkValidation } from 'middleware/validation/checkValidation';
import { validatorCreateTask } from 'middleware/validation/tasks/validatorCreateTask';
import { validatorUpdateTask } from 'middleware/validation/tasks/validatorUpdateTask';

import { TaskController } from '../../controllers/tasks/TaskController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Создание задачи
router.post('/', [checkJwt, upload.single('file'), checkValidation], TaskController.create);

// Получение всех задач
router.get('/', [checkJwt], TaskController.getAll);

// Получение одной задачи по ID
router.get('/:id', [checkJwt], TaskController.getOne);

router.post('/test-upload', [checkJwt, upload.single('file')], TaskController.testUpload);

// Обновление задачи
// router.put('/:id', [checkJwt, ...validatorUpdateTask, upload.single('file'), checkValidation], TaskController.update);

// Удаление задачи
router.delete('/:id', [checkJwt], TaskController.delete);

// Массовое удаление задач
router.delete('/', [checkJwt], TaskController.deleteMany);

export default router;
