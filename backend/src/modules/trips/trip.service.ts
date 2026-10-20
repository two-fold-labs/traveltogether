import { randomInt } from 'node:crypto';

import { withTransaction } from '#config/db.js';
import { NotFoundError, ValidationError } from '#errors/app-error.js';
import { googlePlacesClient } from '#integrations/google/places/google-places.client.js';

import {
  TRIP_ID_ALPHABET,
  TRIP_ID_MAX_ATTEMPTS,
  TRIP_ID_PREFIX,
  TRIP_ID_SUFFIX_LENGTH,
} from './trip.constants.js';
import { mapTrip } from './trip.mapper.js';
import * as tripRepository from './trip.repository.js';

const createTrip = async (
  name: string,
  destinationPlaceId: string,
  arriveBy: Date,
  userId: string,
) => {
  const placeDetails =
    await googlePlacesClient.getPlaceDetails(destinationPlaceId);

  if (!placeDetails) {
    throw new ValidationError([
      {
        field: 'destinationPlaceId',
        message: 'Destination place not found.',
      },
    ]);
  }

  const tripWithDestination = await withTransaction(async () => {
    const location = await tripRepository.insertLocation({
      name: placeDetails.name,
      address: placeDetails.address,
      lat: placeDetails.lat,
      lng: placeDetails.lng,
    });

    // ON CONFLICT keeps the transaction alive on an ID collision, so retry here.
    for (let attempt = 0; attempt < TRIP_ID_MAX_ATTEMPTS; attempt++) {
      const trip = await tripRepository.insertTrip({
        tripId: generateTripId(),
        name,
        arriveBy,
        createdBy: userId,
        destinationLocationId: location.id,
      });

      if (trip) {
        return { trip, location };
      }
    }

    throw new Error('Failed to generate a unique trip ID.');
  });

  return mapTrip(tripWithDestination.trip, tripWithDestination.location);
};

const getTrip = async (tripId: string) => {
  const tripWithDestination =
    await tripRepository.findTripWithDestinationByTripId(tripId);

  if (!tripWithDestination) {
    throw new NotFoundError('Trip not found.');
  }

  return mapTrip(tripWithDestination.trip, tripWithDestination.location);
};

const generateTripId = () => {
  let suffix = '';

  for (let i = 0; i < TRIP_ID_SUFFIX_LENGTH; i++) {
    suffix += TRIP_ID_ALPHABET.charAt(randomInt(TRIP_ID_ALPHABET.length));
  }

  return `${TRIP_ID_PREFIX}${suffix}`;
};

export { createTrip, getTrip };
