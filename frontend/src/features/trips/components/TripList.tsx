import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { type TripCardData } from '../types';
import TripCard from './TripCard';

interface TripListProps {
  trips: TripCardData[];
  isLoading: boolean;
  previewCount: number;
  onViewTrip: (tripId: string) => void;
  onEditTrip: (tripId: string) => void;
}

const TripList = ({
  trips,
  isLoading,
  previewCount,
  onViewTrip,
  onEditTrip,
}: TripListProps) => {
  if (isLoading) {
    return Array.from({ length: previewCount }, (_, index) => (
      <Skeleton key={index} variant="rounded" className="h-44 rounded-3xl" />
    ));
  }

  if (trips.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        className="rounded-3xl border-2 border-dashed border-border p-6 text-center"
      >
        No upcoming trips yet. Plan one or join with a code.
      </Typography>
    );
  }

  return trips
    .slice(0, previewCount)
    .map((trip) => (
      <TripCard
        key={trip.tripId}
        trip={trip}
        onView={onViewTrip}
        onEdit={onEditTrip}
      />
    ));
};

export default TripList;
