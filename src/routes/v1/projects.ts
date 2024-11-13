import { Router } from 'express';

import { checkJwt } from 'middleware/checkJwt';
import { checkValidation } from 'middleware/validation/checkValidation';
import { validateProjectExists } from 'middleware/validation/projects/validateProjectExists';
import { validatorCreateProject } from 'middleware/validation/projects/validatorCreateProject';
import { validatorUpdateProject } from 'middleware/validation/projects/validatorUpdateProject';

import { ProjectController } from '../../controllers/projects/ProjectController';

const router = Router();

// Создание проекта
router.post('/', [checkJwt, ...validatorCreateProject, checkValidation], ProjectController.create);

// Получение всех проектов
router.get('/', [checkJwt], ProjectController.getAll);

// Получение одного проекта по ID
router.get('/:id', [checkJwt, checkValidation], ProjectController.getOne);

// Обновление проекта
router.put('/:id', [checkJwt, checkValidation], ProjectController.update);

// Удаление проекта
router.delete('/:id', [checkJwt, checkValidation], ProjectController.delete);

export default router;
