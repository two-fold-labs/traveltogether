import * as z from 'zod';

import {
  LATITUDE_MAX,
  LATITUDE_MIN,
  LOCATION_ADDRESS_MAX_LENGTH,
  LOCATION_NAME_MAX_LENGTH,
  LONGITUDE_MAX,
  LONGITUDE_MIN,
} from '#constants/location.constants.js';

const createTripSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters'),
    destinationPlaceId: z.string().trim().min(1),
    arriveBy: z.coerce.date(),
  })
  .refine((data) => data.arriveBy > new Date(), {
    error: 'ArriveBy must be in future',
    path: ['arriveBy'],
  });

const getTripSchema = z.object({
  tripId: z.string().trim().min(1).max(12),
});

const joinTripSchema = z.object({
  sourceLocation: z.object({
    name: z.string().trim().min(1).max(LOCATION_NAME_MAX_LENGTH),
    address: z.string().trim().max(LOCATION_ADDRESS_MAX_LENGTH),
    lat: z.number().min(LATITUDE_MIN).max(LATITUDE_MAX),
    lng: z.number().min(LONGITUDE_MIN).max(LONGITUDE_MAX),
  }),
});

export type GetTripParams = z.infer<typeof getTripSchema>;

export type CreateTripBody = z.infer<typeof createTripSchema>;

export type JoinTripBody = z.infer<typeof joinTripSchema>;

export { createTripSchema, getTripSchema, joinTripSchema };
