export const TRIP_STATUS = {
  CREATED: 'created',
  STARTED: 'started',
  ENDED: 'ended',
} as const;

export type TripStatus = (typeof TRIP_STATUS)[keyof typeof TRIP_STATUS];

export const TRIP_ID_PREFIX = 'TT-';
export const TRIP_ID_SUFFIX_LENGTH = 8;
// Excludes look-alike characters: I, L, O, 0, 1.
export const TRIP_ID_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const TRIP_ID_MAX_ATTEMPTS = 5;
