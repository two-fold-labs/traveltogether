import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

import StatItem from '@/components/ui/StatItem';
import { formatDistance } from '@/lib/formatDistance';
import { formatDuration } from '@/lib/formatDuration';

import { type TripRouteSummary } from '../types';

const EMPTY_VALUE = '--';

interface TripRouteStatsProps {
  route?: TripRouteSummary;
}

// Formats a value, or shows EMPTY_VALUE when it is missing or invalid
const display = (
  value: number | null | undefined,
  format: (value: number) => string,
): string => {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }

  return format(value) || EMPTY_VALUE;
};

const formatStopCount = (count: number): string =>
  Number.isInteger(count) && count >= 0 ? String(count) : '';

// The current user's planned route. Always rendered; unknown values show "--".
const TripRouteStats = ({ route }: TripRouteStatsProps) => (
  <Stack
    direction="row"
    divider={<Divider orientation="vertical" flexItem />}
    className="rounded-2xl border border-border bg-background py-2.5 text-center"
  >
    <StatItem
      label="Distance"
      value={display(route?.distanceMeters, formatDistance)}
      className="flex-1"
    />
    <StatItem
      label="Est. drive"
      value={display(route?.durationSeconds, formatDuration)}
      className="flex-1"
    />
    <StatItem
      label="Stops"
      value={display(route?.stopCount, formatStopCount)}
      className="flex-1"
    />
  </Stack>
);

export default TripRouteStats;
