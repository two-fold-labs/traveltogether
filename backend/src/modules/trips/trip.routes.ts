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
router.get('/:tripId/invite', getTripInvite);
router.post('/:tripId/participants', joinTrip);
router.get('/:tripId', getTrip);

export default router;
