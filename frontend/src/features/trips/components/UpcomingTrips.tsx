import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Icon } from '@/components/ui/Icon';

import { type Trip } from '../types';
import TripList from './TripList';

const PREVIEW_COUNT = 2;

interface UpcomingTripsProps {
  currentUserId: string;
  // Upcoming trips only, already sorted soonest first by the API
  trips: Trip[];
  isLoading?: boolean;
  onViewTrip: (tripId: string) => void;
  onEditTrip: (tripId: string) => void;
  onSeeAll: () => void;
}

const UpcomingTrips = ({
  currentUserId,
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
          className="flex items-center gap-1.5"
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
        currentUserId={currentUserId}
        trips={trips}
        isLoading={isLoading}
        previewCount={PREVIEW_COUNT}
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
