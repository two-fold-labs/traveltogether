import { Router } from 'express';

import { requireAuth } from '#middlewares/auth.middleware.js';

import authRouter from './modules/auth/auth.routes.js';
import placesRouter from './modules/places/place.routes.js';
import tripRouter from './modules/trips/trip.routes.js';

const router = Router();

router.use('/trips', requireAuth, tripRouter);
router.use('/places', requireAuth, placesRouter);
router.use('/auth', authRouter);

export default router;
