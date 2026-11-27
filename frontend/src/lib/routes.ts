const ROUTES = {
  HOME: '/',
  CREATE_TRIP: '/trips/new',
  JOIN: '/join/:tripId',
} as const;

const joinTripPath = (tripId: string) => `/join/${encodeURIComponent(tripId)}`;

export { ROUTES, joinTripPath };
