import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Icon } from '@/components/ui/Icon';

import { type TripCardData } from '../types';
import TripCard from './TripCard';

const PREVIEW_COUNT = 2;

interface UpcomingTripsProps {
  // Upcoming trips only, already sorted soonest first
  trips: TripCardData[];
  isLoading?: boolean;
  onViewTrip: (tripId: string) => void;
  onEditTrip: (tripId: string) => void;
  onSeeAll: () => void;
}

interface TripListProps {
  trips: TripCardData[];
  isLoading: boolean;
  onViewTrip: (tripId: string) => void;
  onEditTrip: (tripId: string) => void;
}

const TripList = ({
  trips,
  isLoading,
  onViewTrip,
  onEditTrip,
}: TripListProps) => {
  if (isLoading) {
    return Array.from({ length: PREVIEW_COUNT }, (_, index) => (
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
    .slice(0, PREVIEW_COUNT)
    .map((trip) => (
      <TripCard
        key={trip.tripId}
        trip={trip}
        onView={onViewTrip}
        onEdit={onEditTrip}
      />
    ));
};

const UpcomingTrips = ({
  trips,
  isLoading = false,
  onViewTrip,
  onEditTrip,
  onSeeAll,
}: UpcomingTripsProps) => {
  const hiddenCount = trips.length - PREVIEW_COUNT;

  return (
    <Stack component="section" spacing={3}>
      <Stack
        direction="row"
        spacing={2}
        className="items-center justify-between"
      >
        <Typography
          variant="overline"
          component="h3"
          color="text.secondary"
          className="flex items-center gap-1.5 uppercase"
        >
          <Icon name="suitcaseRolling" className="text-brand-500" />
          Upcoming Trips
        </Typography>
        {!isLoading && trips.length > 0 && (
          <Button
            variant="text"
            size="small"
            endIcon={<Icon name="angleRight" />}
            onClick={onSeeAll}
          >
            See all
          </Button>
        )}
      </Stack>

      <TripList
        trips={trips}
        isLoading={isLoading}
        onViewTrip={onViewTrip}
        onEditTrip={onEditTrip}
      />

      {!isLoading && hiddenCount > 0 && (
        <Button
          variant="subtle"
          onClick={onSeeAll}
          className="h-10 rounded-2xl"
        >
          View {hiddenCount} more upcoming trip{hiddenCount === 1 ? '' : 's'}
        </Button>
      )}
    </Stack>
  );
};

export default UpcomingTrips;
