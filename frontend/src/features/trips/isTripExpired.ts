import type { Trip } from './types';

// A trip is expired when it was never started and its arrival time has passed.
// A trip without an arrival time never expires.
// TODO(TT-15): derive the expired status in the backend and filter on it there,
// so expired trips don't use up TRIP_LIST_LIMIT. Then remove this helper.
const isTripExpired = (trip: Trip, now = new Date()) => {
  if (trip.status !== 'created' || !trip.arriveBy) {
    return false;
  }

  return new Date(trip.arriveBy).getTime() < now.getTime();
};

export { isTripExpired };
