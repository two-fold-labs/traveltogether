import * as z from 'zod';

import {
  LATITUDE_MAX,
  LATITUDE_MIN,
  LONGITUDE_MAX,
  LONGITUDE_MIN,
  PLACE_ID_MAX_LENGTH,
  PLACE_ID_PATTERN,
  PLACE_SEARCH_MAX_LENGTH,
} from './place.constants.js';

// Query params are strings. The non-empty check comes first because
// Number('') is 0, which would pass as a valid coordinate. z.number() already
// rejects NaN and Infinity.
const coordinateSchema = (min: number, max: number) =>
  z.string().trim().min(1).transform(Number).pipe(z.number().min(min).max(max));

const coordinatesQuerySchema = z.object({
  lat: coordinateSchema(LATITUDE_MIN, LATITUDE_MAX),
  lng: coordinateSchema(LONGITUDE_MIN, LONGITUDE_MAX),
});

const searchPlaceQuerySchema = coordinatesQuerySchema.extend({
  q: z.string().trim().min(1).max(PLACE_SEARCH_MAX_LENGTH),
});

const reversePlaceQuerySchema = coordinatesQuerySchema;

const getPlaceDetailsParamsSchema = z.object({
  placeId: z
    .string()
    .trim()
    .min(1)
    .max(PLACE_ID_MAX_LENGTH)
    .regex(PLACE_ID_PATTERN),
});

export type SearchPlaceQuery = z.infer<typeof searchPlaceQuerySchema>;

export type ReversePlaceQuery = z.infer<typeof reversePlaceQuerySchema>;

export type GetPlaceDetailsParams = z.infer<typeof getPlaceDetailsParamsSchema>;

export {
  searchPlaceQuerySchema,
  reversePlaceQuerySchema,
  getPlaceDetailsParamsSchema,
};
