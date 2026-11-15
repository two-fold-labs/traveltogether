import { type TripCardData } from './types';

const HOUR_MS = 60 * 60 * 1000;
const inHours = (hours: number) =>
  new Date(Date.now() + hours * HOUR_MS).toISOString();

// Temporary data until the home page is wired to GET /trips.
// At most one trip is live at a time; null when none is.
export const mockLiveTrip: TripCardData | null = {
  tripId: 'mock-live',
  name: 'Weekend in Napa',
  destinationName: 'Napa Valley, CA',
  arriveBy: inHours(3),
  status: 'started',
  isOwner: true,
};

export const mockUpcomingTrips: TripCardData[] = [
  {
    tripId: 'mock-1',
    name: 'Tahoe Ski Trip',
    destinationName: 'South Lake Tahoe, CA',
    arriveBy: inHours(72),
    status: 'created',
    isOwner: false,
    route: { distanceMeters: 304_000, durationSeconds: 12_600, stopCount: 2 },
  },
  {
    tripId: 'mock-2',
    name: 'Big Sur Coastal Drive',
    destinationName: 'Big Sur, CA',
    arriveBy: inHours(24 * 10),
    status: 'created',
    isOwner: true,
    // partly known: shows "--" for the missing values
    route: { distanceMeters: 245_500, durationSeconds: null, stopCount: 0 },
  },
  {
    tripId: 'mock-3',
    name: 'Yosemite Weekend',
    destinationName: 'Yosemite Valley, CA',
    arriveBy: inHours(24 * 21),
    status: 'created',
    isOwner: true,
    // no route yet: all three show "--"
  },
];
