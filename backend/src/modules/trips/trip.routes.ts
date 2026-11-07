import { Router } from 'express';

import { createTrip, getTrip } from './trip.controller.js';

const router = Router();

router.post('/', createTrip);
router.get('/:tripId', getTrip);

export default router;
