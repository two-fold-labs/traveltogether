import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import FormField from '@/components/ui/FormField';
import { formatDateTime } from '@/lib/formatDate';
import { ROUTES } from '@/lib/routes';

import { useJoinTrip } from '../hooks/useJoinTrip';
import { type PlaceSuggestion, type TripInvite } from '../types';
import DestinationField from './DestinationField';
import InviteEnded from './InviteEnded';
import InviteUnavailable from './InviteUnavailable';

interface InviteDetailsProps {
  trip: TripInvite;
}

const InviteDetails = ({ trip }: InviteDetailsProps) => {
  const navigate = useNavigate();
  const mutation = useJoinTrip();
  const [startingPoint, setStartingPoint] = useState<PlaceSuggestion | null>(
    null,
  );
  const [startingPointError, setStartingPointError] = useState<
    string | undefined
  >();

  const handleJoin = () => {
    if (!startingPoint) {
      setStartingPointError('Select a starting point');

      return;
    }

    mutation.mutate(
      { tripId: trip.tripId, placeId: startingPoint.id },
      {
        onSuccess: () => {
          void navigate(ROUTES.HOME, { replace: true });
        },
      },
    );
  };

  if (mutation.error?.status === 409) {
    return <InviteEnded tripName={trip.name} />;
  }

  if (mutation.error?.status === 404) {
    return <InviteUnavailable code={trip.tripId} />;
  }

  return (
    <Stack spacing={6} className="min-h-0 flex-1 p-5">
      <Stack spacing={1.5}>
        <Typography variant="h1" component="h1">
          {trip.name}
        </Typography>
        <Typography color="text.secondary">
          {trip.hostName} invited you
        </Typography>
      </Stack>

      <Stack component="dl" spacing={4}>
        <div>
          <Typography variant="overline" component="dt" color="text.secondary">
            Arrive
          </Typography>
          <Typography variant="body1" component="dd" className="font-semibold">
            {formatDateTime(trip.arriveBy) || 'No arrival time'}
          </Typography>
        </div>
        <div>
          <Typography variant="overline" component="dt" color="text.secondary">
            Route
          </Typography>
          <Typography variant="body1" component="dd" className="font-semibold">
            {trip.destination.name}
            {trip.destination.address ? (
              <Typography
                variant="caption"
                color="text.secondary"
                component="span"
                className="mt-0.5 block"
              >
                {trip.destination.address}
              </Typography>
            ) : null}
          </Typography>
        </div>
      </Stack>

      <Stack spacing={2}>
        <FormField
          label="Your starting point"
          htmlFor="starting-point"
          required
        >
          <DestinationField
            id="starting-point"
            value={startingPoint}
            originLat={String(trip.destination.lat)}
            originLng={String(trip.destination.lng)}
            selectedIcon="locationDot"
            onChange={(next) => {
              setStartingPoint(next);
              setStartingPointError(undefined);
            }}
            error={startingPointError}
          />
        </FormField>
        {mutation.isError ? (
          <Alert severity="error">{mutation.error.message}</Alert>
        ) : null}
        <Typography
          variant="caption"
          color="text.secondary"
          className="font-normal"
        >
          Join to see the shared itinerary.
        </Typography>
        <Button
          variant="contained"
          fullWidth
          disabled={mutation.isPending}
          className="h-12 rounded-2xl"
          onClick={handleJoin}
        >
          {mutation.isPending ? 'Joining...' : 'Join trip'}
        </Button>
        <Button
          variant="subtle"
          fullWidth
          className="h-12 rounded-2xl"
          component={Link}
          to={ROUTES.HOME}
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};

export default InviteDetails;
