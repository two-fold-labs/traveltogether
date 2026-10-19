export const TRIP_STATUS = {
  CREATED: 'created',
  STARTED: 'started',
  ENDED: 'ended',
} as const;

export type TripStatus = (typeof TRIP_STATUS)[keyof typeof TRIP_STATUS];
