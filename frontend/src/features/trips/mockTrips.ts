import { type TripCardData } from './types';

const HOUR_MS = 60 * 60 * 1000;
const inHours = (hours: number) =>
  new Date(Date.now() + hours * HOUR_MS).toISOString();

// Temporary data until the home page is wired to GET /trips.
export const mockUpcomingTrips: TripCardData[] = [
  {
    tripId: 'mock-1',
    name: 'Weekend in Napa',
    destinationName: 'Napa Valley, CA',
    arriveBy: inHours(3),
    status: 'started',
    isOwner: true,
  },
  {
    tripId: 'mock-2',
    name: 'Tahoe Ski Trip',
    destinationName: 'South Lake Tahoe, CA',
    arriveBy: inHours(72),
    status: 'created',
    isOwner: false,
  },
  {
    tripId: 'mock-3',
    name: 'Big Sur Coastal Drive',
    destinationName: 'Big Sur, CA',
    arriveBy: inHours(24 * 10),
    status: 'created',
    isOwner: true,
  },
];
