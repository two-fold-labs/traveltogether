import { Router } from 'express';

import { createTrip, getTrip, getTrips } from './trip.controller.js';

const router = Router();

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:tripId', getTrip);

export default router;
