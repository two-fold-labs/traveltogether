import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTrip } from '../api';
import { tripKeys } from '../queryKeys';

const useCreateTrip = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTrip,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: tripKeys.list(),
        refetchType: 'all',
      }),
  });

  return mutation;
};

export { useCreateTrip };
