import { Router } from 'express';

import {
  createTrip,
  getTrip,
  getTripInvite,
  getTrips,
  joinTrip,
} from './trip.controller.js';

const router = Router();

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/join/:tripId', getTripInvite);
router.post('/join/:tripId', joinTrip);
router.get('/:tripId', getTrip);

export default router;
