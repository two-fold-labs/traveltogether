import type { RequestHandler } from 'express';

import { createTripSchema, getTripSchema } from './trip.schema.js';
import * as tripService from './trip.service.js';

const createTrip: RequestHandler = async (req, res, next) => {
  try {
    const tripData = createTripSchema.parse(req.body);
    const { name, destinationPlaceId, arriveBy } = tripData;

    const response = await tripService.createTrip(
      name,
      destinationPlaceId,
      arriveBy,
    );

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getTrip: RequestHandler = async (req, res, next) => {
  try {
    const tripData = getTripSchema.parse(req.params);

    const response = await tripService.getTrip(tripData.tripId);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export { createTrip, getTrip };
