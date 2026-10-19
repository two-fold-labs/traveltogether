import { Router } from 'express';

import * as authController from './auth.controller.js';

const router = Router();

router.post('/guest', authController.guestLogin);

export default router;
