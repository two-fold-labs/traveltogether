import { Router } from 'express';

import * as placeController from './place.controller.js';

const router = Router();

router.get('/search', placeController.searchPlace);
router.get('/reverse', placeController.reversePlace);
// After /search and /reverse: PLACE_ID_PATTERN also matches those words.
router.get('/:placeId', placeController.getPlaceDetails);

export default router;
