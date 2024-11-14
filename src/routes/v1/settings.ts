import { Router } from 'express';

import { SettingsController } from 'controllers/settings/SettingsController';
import { checkJwt } from 'middleware/checkJwt';
import { validateProjectExists } from 'middleware/validation/projects/validateProjectExists';

const router = Router();

router.get('/', [checkJwt, ...validateProjectExists], SettingsController.getAll);

export default router;
