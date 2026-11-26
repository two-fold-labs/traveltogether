import type { Trip } from './types';

const isTripOwner = (currentUserId: string, trip: Trip) => {
  return trip.participants.some(
    (participant) =>
      participant.userId === currentUserId && participant.isOwner,
  );
};

export { isTripOwner };
