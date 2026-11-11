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
import type { PublicTrip, TripParticipantsRow } from './trip.types.js';

const createTrip = async (
  name: string,
  destinationPlaceId: string,
  arriveBy: Date,
  userId: string,
): Promise<PublicTrip> => {
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

  const tripWithDetails = await withTransaction(async () => {
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
        // Todo: We are passing destinationId as source_location_id. Later, we'll get the data from UI and pass it.
        const participant = await tripRepository.insertTripParticipant({
          tripRowId: trip.id,
          userId,
          isOwner: true,
          sourceLocationId: location.id,
        });

        return { trip, location, participant };
      }
    }

    throw new Error('Failed to generate a unique trip ID.');
  });

  return mapTrip(tripWithDetails.trip, tripWithDetails.location, [
    tripWithDetails.participant,
  ]);
};

const getTrip = async (userId: string, tripId: string): Promise<PublicTrip> => {
  const tripWithDestination =
    await tripRepository.findTripWithDestinationByTripId(tripId);

  if (!tripWithDestination) {
    throw new NotFoundError('Trip not found.');
  }

  const tripParticipants = await tripRepository.findTripParticipantsByTripRowId(
    tripWithDestination.trip.id,
  );
  const isUserTripParticipant = tripParticipants.some(
    (participant) => participant.user_id === userId,
  );

  if (!isUserTripParticipant) {
    throw new NotFoundError('Trip not found.');
  }

  return mapTrip(
    tripWithDestination.trip,
    tripWithDestination.location,
    tripParticipants,
  );
};

const getTrips = async (userId: string): Promise<PublicTrip[]> => {
  const tripsWithDestination =
    await tripRepository.findTripsWithDestinationByUserId(userId);

  if (tripsWithDestination.length === 0) {
    return [];
  }

  const participants = await tripRepository.findTripParticipantsByTripRowIds(
    tripsWithDestination.map(({ trip }) => trip.id),
  );

  const participantsByTripRowId = new Map<string, TripParticipantsRow[]>();

  for (const participant of participants) {
    const tripParticipants = participantsByTripRowId.get(participant.trip_id);

    if (tripParticipants) {
      tripParticipants.push(participant);
    } else {
      participantsByTripRowId.set(participant.trip_id, [participant]);
    }
  }

  return tripsWithDestination.map(({ trip, location }) =>
    mapTrip(trip, location, participantsByTripRowId.get(trip.id) ?? []),
  );
};

const generateTripId = () => {
  let suffix = '';

  for (let i = 0; i < TRIP_ID_SUFFIX_LENGTH; i++) {
    suffix += TRIP_ID_ALPHABET.charAt(randomInt(TRIP_ID_ALPHABET.length));
  }

  return `${TRIP_ID_PREFIX}${suffix}`;
};

export { createTrip, getTrip, getTrips };
