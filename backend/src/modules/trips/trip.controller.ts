import type { RequestHandler } from 'express';

import { getUserId } from '#middlewares/auth.middleware.js';

import {
  createTripSchema,
  getTripSchema,
  joinTripSchema,
} from './trip.schema.js';
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

const getTrips: RequestHandler = async (_req, res, next) => {
  try {
    const userId = getUserId(res);
    const response = await tripService.getTrips(userId);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const getTrip: RequestHandler = async (req, res, next) => {
  try {
    const userId = getUserId(res);
    const { tripId } = getTripSchema.parse(req.params);

    const response = await tripService.getTrip(userId, tripId);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const getTripInvite: RequestHandler = async (req, res, next) => {
  try {
    const userId = getUserId(res);
    const { tripId } = getTripSchema.parse(req.params);

    const trip = await tripService.getTripInvite(userId, tripId);

    res.status(200).json({ trip });
  } catch (error) {
    next(error);
  }
};

const joinTrip: RequestHandler = async (req, res, next) => {
  try {
    const userId = getUserId(res);
    const { tripId } = getTripSchema.parse(req.params);
    const { sourceLocation } = joinTripSchema.parse(req.body);

    const result = await tripService.joinTrip(userId, tripId, sourceLocation);

    res.status(result.created ? 201 : 200).json({
      tripId: result.tripId,
      joined: result.joined,
    });
  } catch (error) {
    next(error);
  }
};

export { createTrip, getTrip, getTripInvite, getTrips, joinTrip };
