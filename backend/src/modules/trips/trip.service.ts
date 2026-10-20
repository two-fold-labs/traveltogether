import { withTransaction } from '#config/db.js';
import { NotFoundError, ValidationError } from '#errors/app-error.js';
import { googlePlacesClient } from '#integrations/google/places/google-places.client.js';

import { generateRandomString } from '../../shared/utils/generate-random-string.js';

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

  const tripDetails = await withTransaction(async () => {
    const location = await tripRepository.insertLocation({
      name: placeDetails.name,
      address: placeDetails.address,
      lat: placeDetails.lat,
      lng: placeDetails.lng,
    });

    const trip = await tripRepository.insertTrip({
      tripId: generateTripId(),
      name,
      arriveBy,
      createdBy: userId,
      destinationLocationId: location.id,
    });

    return { trip, location };
  });

  return mapTrip(tripDetails.trip, tripDetails.location);
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
  return generateRandomString();
};

export { createTrip, getTrip };
