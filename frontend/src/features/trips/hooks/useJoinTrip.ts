import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getPlaceDetails, joinTrip } from '../api';
import { tripKeys } from '../queryKeys';

interface JoinTripVariables {
  tripId: string;
  placeId: string;
}

const useJoinTrip = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ tripId, placeId }: JoinTripVariables) => {
      const place = await getPlaceDetails(placeId);

      return joinTrip(tripId, {
        sourceLocation: {
          name: place.name,
          address: place.address,
          lat: place.lat,
          lng: place.lng,
        },
      });
    },
    onSuccess: (_data, { tripId }) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: tripKeys.list(),
          refetchType: 'all',
        }),
        queryClient.invalidateQueries({
          queryKey: tripKeys.invite(tripId),
        }),
      ]),
  });

  return mutation;
};

export { useJoinTrip };
