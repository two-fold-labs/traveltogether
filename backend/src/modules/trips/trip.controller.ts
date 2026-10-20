import type { RequestHandler } from 'express';

import { getUserId } from '#middlewares/auth.middleware.js';

import { createTripSchema, getTripSchema } from './trip.schema.js';
import * as tripService from './trip.service.js';

const createTrip: RequestHandler = async (req, res, next) => {
  try {
    const userId = getUserId(res);
    const { name, destinationPlaceId, arriveBy } = createTripSchema.parse(
      req.body,
    );

    const response = await tripService.createTrip(
      name,
      destinationPlaceId,
      arriveBy,
      userId,
    );

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getTrip: RequestHandler = async (req, res, next) => {
  try {
    const { tripId } = getTripSchema.parse(req.params);

    const response = await tripService.getTrip(tripId);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export { createTrip, getTrip };
