import { useNavigate } from 'react-router';

import {
  CreateTripForm,
  type CreateTripValues,
  useCreateTrip,
} from '@/features/trips';
import { ROUTES } from '@/lib/routes';

const CreateTripPage = () => {
  const mutation = useCreateTrip();
  const navigate = useNavigate();

  const handleSubmit = (values: CreateTripValues) => {
    const { tripName, arriveBy, destination } = values;

    if (!destination) {
      return;
    }

    mutation.mutate(
      {
        name: tripName,
        arriveBy: new Date(arriveBy).toISOString(),
        destinationPlaceId: destination.id,
      },
      {
        onSuccess: () => {
          void navigate(ROUTES.HOME, { replace: true });
        },
      },
    );
  };

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-3 pt-4 sm:px-4 sm:pt-6">
      <CreateTripForm
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        submitError={mutation.error?.message}
      />
    </main>
  );
};

export default CreateTripPage;
