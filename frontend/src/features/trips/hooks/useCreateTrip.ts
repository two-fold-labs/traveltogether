import { useMutation } from '@tanstack/react-query';

import { createTrip } from '../api';

const useCreateTrip = () => {
  const mutation = useMutation({
    mutationFn: createTrip,
  });

  return mutation;
};

export { useCreateTrip };
