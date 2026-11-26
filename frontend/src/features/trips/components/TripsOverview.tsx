import Stack from '@mui/material/Stack';

import ErrorState from '@/components/ui/ErrorState';

import { useTrips } from '../hooks/useTrips';
import { isTripExpired } from '../isTripExpired';
import LiveTripCard from './LiveTripCard';
import UpcomingTrips from './UpcomingTrips';

interface TripsOverviewProps {
  currentUserId: string;
}

const TripsOverview = ({ currentUserId }: TripsOverviewProps) => {
  const { data, isPending, isError, refetch, isFetching } = useTrips();

  // Only when there is nothing to show. If a background refetch fails, keep
  // showing the trips already in the cache.
  if (isError && !data) {
    return (
      <ErrorState
        title="Can't load your trips"
        message="Something went wrong while loading your trips. Try again in a moment."
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  // Empty while loading; the upcoming list shows skeletons until data arrives
  const trips = data?.trips ?? [];
  // The home page shows only the first live trip.
  const liveTrip = trips.find((trip) => trip.status === 'started');
  const upcomingTrips = trips.filter(
    (trip) => trip.status === 'created' && !isTripExpired(trip),
  );

  // TODO(TT-21): open the trip page from onOpen and onViewTrip
  // TODO(TT-22): open the edit page from onEditTrip
  // TODO(TT-9): go to My Trips from onSeeAll
  return (
    <Stack spacing={6}>
      {liveTrip && <LiveTripCard trip={liveTrip} onOpen={() => undefined} />}

      <UpcomingTrips
        currentUserId={currentUserId}
        isLoading={isPending}
        trips={upcomingTrips}
        onViewTrip={() => undefined}
        onEditTrip={() => undefined}
        onSeeAll={() => undefined}
      />
    </Stack>
  );
};

export default TripsOverview;
