import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Icon } from '@/components/ui/Icon';
import { formatDateTime } from '@/lib/formatDate';

import { type Trip } from '../types';

interface LiveTripCardProps {
  trip: Trip;
  onOpen: (tripId: string) => void;
}

const LiveTripCard = ({ trip, onOpen }: LiveTripCardProps) => {
  const arrival = formatDateTime(trip.arriveBy);

  return (
    <Stack
      component="article"
      aria-label={`Live trip: ${trip.name}`}
      spacing={4}
      className="rounded-3xl border border-success/40 bg-success/5 p-4 shadow-sm sm:p-5"
    >
      <Stack spacing={1.5}>
        <Typography
          variant="badge"
          component="span"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-success/15 px-2.5 py-1 text-success"
        >
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success" />
            <span className="relative size-2 rounded-full bg-success" />
          </span>
          Live now
        </Typography>

        <Typography variant="h3" component="h3">
          {trip.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          className="flex min-w-0 items-center gap-1.5"
        >
          <Icon name="locationDot" className="shrink-0" />
          <span className="truncate">{trip.destination.name}</span>
        </Typography>

        {arrival && (
          <Typography
            variant="body2"
            color="text.secondary"
            className="flex items-center gap-1.5"
          >
            <Icon name="flagCheckered" className="shrink-0" />
            Arrive by {arrival}
          </Typography>
        )}
      </Stack>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Icon name="locationCrosshairs" />}
        onClick={() => onOpen(trip.tripId)}
        className="h-11 rounded-2xl"
      >
        Open live trip
      </Button>
    </Stack>
  );
};

export default LiveTripCard;
