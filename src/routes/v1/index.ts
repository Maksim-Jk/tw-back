import { Router } from 'express';

import auth from './auth';
import projects from './projects';
import settingsRouter from './settings';
import tasksRouter from './tasks';
import users from './users';

const router = Router();

router.use('/auth', auth);
router.use('/users', users);
router.use('/tasks', tasksRouter);
router.use('/settings', settingsRouter);
router.use('/projects', projects);

export default router;
