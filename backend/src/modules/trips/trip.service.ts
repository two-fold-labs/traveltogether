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
import { mapTrip, mapTripInvite } from './trip.mapper.js';
import * as tripRepository from './trip.repository.js';
import type { JoinTripBody } from './trip.schema.js';
import type {
  JoinTripResult,
  PublicTrip,
  PublicTripInvite,
  PublicTripList,
  TripParticipantRow,
} from './trip.types.js';

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

  const createdTrip = await withTransaction(async () => {
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
        // TODO: Using the destination location as source_location_id for now. Later, the UI will send the source location.
        const participant = await tripRepository.insertTripParticipant({
          tripRowId: trip.id,
          userId,
          isOwner: true,
          sourceLocationId: location.id,
        });

        if (!participant) {
          throw new Error('Failed to insert trip participant');
        }

        return { trip, location, participant };
      }
    }

    throw new Error('Failed to generate a unique trip ID.');
  });

  return mapTrip(createdTrip.trip, createdTrip.location, [
    createdTrip.participant,
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

const getTrips = async (userId: string): Promise<PublicTripList> => {
  const tripsWithDestination =
    await tripRepository.findTripsWithDestinationByUserId(userId);

  if (tripsWithDestination.length === 0) {
    return { trips: [] };
  }

  const participants = await tripRepository.findTripParticipantsByTripRowIds(
    tripsWithDestination.map(({ trip }) => trip.id),
  );

  const participantsByTripRowId = new Map<string, TripParticipantRow[]>();

  for (const participant of participants) {
    const tripParticipants = participantsByTripRowId.get(participant.trip_id);

    if (tripParticipants) {
      tripParticipants.push(participant);
    } else {
      participantsByTripRowId.set(participant.trip_id, [participant]);
    }
  }

  return {
    trips: tripsWithDestination.map(({ trip, location }) =>
      mapTrip(trip, location, participantsByTripRowId.get(trip.id) ?? []),
    ),
  };
};

const generateTripId = () => {
  let suffix = '';

  for (let i = 0; i < TRIP_ID_SUFFIX_LENGTH; i++) {
    suffix += TRIP_ID_ALPHABET.charAt(randomInt(TRIP_ID_ALPHABET.length));
  }

  return `${TRIP_ID_PREFIX}${suffix}`;
};

const getTripInvite = async (
  userId: string,
  tripId: string,
): Promise<PublicTripInvite> => {
  const invite = await tripRepository.findTripInviteByTripId(tripId);

  if (!invite) {
    throw new NotFoundError('Trip not found.');
  }

  const participant =
    await tripRepository.findTripParticipantByTripRowIdAndUserId(
      invite.trip.id,
      userId,
    );

  return mapTripInvite(
    invite.trip,
    invite.location,
    invite.hostName,
    participant !== undefined,
  );
};

const joinTrip = async (
  userId: string,
  tripId: string,
  sourceLocation: JoinTripBody['sourceLocation'],
): Promise<JoinTripResult & { created: boolean }> => {
  const tripWithDestination =
    await tripRepository.findTripWithDestinationByTripId(tripId);

  if (!tripWithDestination) {
    throw new NotFoundError('Trip not found.');
  }

  const publicTripId = tripWithDestination.trip.trip_id;

  return withTransaction(async () => {
    const existing =
      await tripRepository.findTripParticipantByTripRowIdAndUserId(
        tripWithDestination.trip.id,
        userId,
      );

    if (existing) {
      return { tripId: publicTripId, joined: true as const, created: false };
    }

    const location = await tripRepository.insertLocation({
      name: sourceLocation.name,
      address: sourceLocation.address,
      lat: sourceLocation.lat,
      lng: sourceLocation.lng,
    });

    const participant = await tripRepository.insertTripParticipant({
      tripRowId: tripWithDestination.trip.id,
      userId,
      isOwner: false,
      sourceLocationId: location.id,
    });

    // A concurrent join can win the unique constraint. The locations row
    // inserted above is then unused; harmless.
    if (!participant) {
      return { tripId: publicTripId, joined: true as const, created: false };
    }

    return { tripId: publicTripId, joined: true as const, created: true };
  });
};

export { createTrip, getTrip, getTripInvite, getTrips, joinTrip };
