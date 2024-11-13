import { Router } from 'express';

import { SettingsController } from 'controllers/settings/SettingsController';

const router = Router();

router.get('/', SettingsController.getAll);

export default router;
