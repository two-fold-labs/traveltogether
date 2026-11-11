import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Icon } from '@/components/ui/Icon';
import { formatDateTime, formatRelativeTime } from '@/lib/formatDate';

import { type TripCardData } from '../types';

interface TripCardProps {
  trip: TripCardData;
  onView: (tripId: string) => void;
  onEdit: (tripId: string) => void;
}

const BADGE_CLASS = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5';

const getStatusLabel = (trip: TripCardData): string => {
  if (trip.status === 'started') {
    return 'Live now';
  }

  const timeUntil = formatRelativeTime(trip.arriveBy);

  return timeUntil ? `Upcoming • ${timeUntil}` : 'Upcoming';
};

const TripCard = ({ trip, onView, onEdit }: TripCardProps) => {
  const isLive = trip.status === 'started';

  return (
    <Stack
      component="article"
      spacing={3}
      className="rounded-3xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-brand-500"
    >
      <Stack spacing={1}>
        <Stack direction="row" useFlexGap className="flex-wrap gap-1.5">
          <Typography
            variant="overline"
            component="span"
            className={
              isLive
                ? `${BADGE_CLASS} bg-success/15 text-success`
                : `${BADGE_CLASS} bg-primary/15 text-primary`
            }
          >
            {getStatusLabel(trip)}
          </Typography>
          <Typography
            variant="overline"
            component="span"
            className={
              trip.isOwner
                ? `${BADGE_CLASS} bg-brand-500/15 text-brand-600 dark:text-brand-300`
                : `${BADGE_CLASS} border border-border bg-background text-muted-foreground`
            }
          >
            <Icon name={trip.isOwner ? 'crown' : 'userGroup'} />
            {trip.isOwner ? 'Owner' : 'Participant'}
          </Typography>
        </Stack>

        <Typography variant="subtitle1" component="h4">
          {trip.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          className="flex min-w-0 items-center gap-1.5"
        >
          <Icon name="locationDot" className="shrink-0" />
          <span className="truncate">{trip.destinationName}</span>
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          className="flex items-center gap-1.5"
        >
          <Icon name="calendarCheck" className="shrink-0" />
          {formatDateTime(trip.arriveBy) || 'No arrival time'}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button
          variant="subtle"
          startIcon={<Icon name="eye" />}
          onClick={() => onView(trip.tripId)}
          className="h-10 flex-1 border border-border bg-background hover:bg-accent"
        >
          View
        </Button>
        {trip.isOwner && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon name="penToSquare" />}
            onClick={() => onEdit(trip.tripId)}
            className="h-10 flex-1"
          >
            Edit Trip
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default TripCard;
