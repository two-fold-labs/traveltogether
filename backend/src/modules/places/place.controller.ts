import type { RequestHandler } from 'express';

import { searchPlaceQuerySchema } from './place.schema.js';
import * as placeService from './place.service.js';

const searchPlace: RequestHandler = async (req, res, next) => {
  try {
    const { q, lat, lng } = searchPlaceQuerySchema.parse(req.query);

    const response = await placeService.getSearchPlaceSuggestions(q, {
      lat,
      lng,
    });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export { searchPlace };
