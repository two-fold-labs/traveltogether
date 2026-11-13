import * as z from 'zod';

import {
  LATITUDE_MAX,
  LATITUDE_MIN,
  LONGITUDE_MAX,
  LONGITUDE_MIN,
  PLACE_SEARCH_MAX_LENGTH,
} from './place.constants.js';

// Query params are strings. The non-empty check comes first because
// Number('') is 0, which would pass as a valid coordinate. z.number() already
// rejects NaN and Infinity.
const coordinateSchema = (min: number, max: number) =>
  z.string().trim().min(1).transform(Number).pipe(z.number().min(min).max(max));

const searchPlaceQuerySchema = z.object({
  q: z.string().trim().min(1).max(PLACE_SEARCH_MAX_LENGTH),
  lat: coordinateSchema(LATITUDE_MIN, LATITUDE_MAX),
  lng: coordinateSchema(LONGITUDE_MIN, LONGITUDE_MAX),
});

export type SearchPlaceQuery = z.infer<typeof searchPlaceQuerySchema>;

export { searchPlaceQuerySchema };
