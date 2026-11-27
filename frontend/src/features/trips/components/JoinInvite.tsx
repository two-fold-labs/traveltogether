import ErrorState from '@/components/ui/ErrorState';

import InviteAlreadyJoined from './InviteAlreadyJoined';
import InviteDetails from './InviteDetails';
import InviteEnded from './InviteEnded';
import InviteLoading from './InviteLoading';
import InviteUnavailable from './InviteUnavailable';
import { useTripInvite } from '../hooks/useTripInvite';

interface JoinInviteProps {
  tripId: string | undefined;
}

const JoinInvite = ({ tripId }: JoinInviteProps) => {
  const { data, isPending, isError, error, refetch, isFetching } =
    useTripInvite(tripId);

  if (tripId && isPending) {
    return <InviteLoading />;
  }

  if (!tripId || (isError && (error.status === 404 || error.status === 422))) {
    return <InviteUnavailable code={tripId ?? ''} />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        size="page"
        title="Couldn't load this invite"
        message="Check your connection and try again."
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  if (data.trip.status === 'ended') {
    return <InviteEnded tripName={data.trip.name} />;
  }

  if (data.trip.alreadyJoined) {
    return <InviteAlreadyJoined tripName={data.trip.name} />;
  }

  return <InviteDetails trip={data.trip} />;
};

export default JoinInvite;
