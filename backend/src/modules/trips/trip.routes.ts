import { Router } from 'express';

import { createTrip } from './trip.controller.js';

const router = Router();

router.post('/', createTrip);

export default router;
