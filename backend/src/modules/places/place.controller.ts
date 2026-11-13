import type { RequestHandler } from 'express';

import {
  getPlaceDetailsParamsSchema,
  reversePlaceQuerySchema,
  searchPlaceQuerySchema,
} from './place.schema.js';
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

const getPlaceDetails: RequestHandler = async (req, res, next) => {
  try {
    const { placeId } = getPlaceDetailsParamsSchema.parse(req.params);

    const response = await placeService.getPlaceLocation(placeId);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const reversePlace: RequestHandler = async (req, res, next) => {
  try {
    const { lat, lng } = reversePlaceQuerySchema.parse(req.query);

    const response = await placeService.reversePlaceLocation({ lat, lng });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export { searchPlace, getPlaceDetails, reversePlace };
