import { Router } from 'express';

import authRouter from './modules/auth/auth.routes.js';
import placesRouter from './modules/places/place.routes.js';
import tripRouter from './modules/trips/trip.routes.js';

const router = Router();

router.use('/trips', tripRouter);
router.use('/places', placesRouter);
router.use('/auth', authRouter);

export default router;
