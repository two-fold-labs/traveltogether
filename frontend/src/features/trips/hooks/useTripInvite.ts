import { skipToken, useQuery } from '@tanstack/react-query';

import { getTripInvite } from '../api';
import { tripKeys } from '../queryKeys';

const useTripInvite = (tripId: string | undefined) => {
  const queryResult = useQuery({
    queryKey: tripKeys.invite(tripId ?? ''),
    queryFn: tripId ? ({ signal }) => getTripInvite(tripId, signal) : skipToken,
  });

  return queryResult;
};

export { useTripInvite };
