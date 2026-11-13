import { Router } from 'express';

import * as placeController from './place.controller.js';

const router = Router();

router.get('/search', placeController.searchPlace);
router.get('/reverse', placeController.reversePlace);
router.get('/details/:placeId', placeController.getPlaceDetails);

export default router;
