import { Router } from 'express';

import { login, register, changePassword } from 'controllers/auth';
import { checkJwt } from 'middleware/checkJwt';
import { validatorLogin, validatorRegister, validatorChangePassword } from 'middleware/validation/auth';
import { validateProjectExists } from 'middleware/validation/projects/validateProjectExists';

const router = Router();

router.post('/login', [validatorLogin, ...validateProjectExists], login);
router.post('/register', [validatorRegister], register);
router.post('/change-password', [checkJwt, validatorChangePassword], changePassword);

export default router;
