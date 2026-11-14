import type {
  LocationRow,
  PublicParticipant,
  PublicTrip,
  PublicTripInvite,
  TripParticipantRow,
  TripRow,
} from './trip.types.js';

export function mapTrip(
  trip: TripRow,
  location: LocationRow,
  participants: TripParticipantRow[],
): PublicTrip {
  const participantsDetails: PublicParticipant[] = participants.map(
    (participant) => {
      return {
        id: participant.id,
        tripId: trip.trip_id,
        userId: participant.user_id,
        isOwner: participant.is_owner,
        joinedAt: participant.joined_at,
      };
    },
  );

  return {
    tripId: trip.trip_id,
    name: trip.name,
    arriveBy: trip.arrive_by,
    status: trip.status,
    createdAt: trip.created_at,
    destination: {
      name: location.name,
      address: location.address ?? '',
      lat: Number(location.latitude),
      lng: Number(location.longitude),
    },
    participants: participantsDetails,
  };
}

export function mapTripInvite(
  trip: TripRow,
  location: LocationRow,
  hostName: string,
  alreadyJoined: boolean,
): PublicTripInvite {
  return {
    tripId: trip.trip_id,
    name: trip.name,
    arriveBy: trip.arrive_by,
    hostName,
    destination: {
      name: location.name,
      address: location.address ?? '',
      lat: Number(location.latitude),
      lng: Number(location.longitude),
    },
    alreadyJoined,
  };
}
