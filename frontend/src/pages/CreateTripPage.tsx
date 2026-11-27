import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  CreateTripForm,
  TripSummaryDialog,
  type CreateTripValues,
  type Trip,
  useCreateTrip,
} from '@/features/trips';
import { ROUTES } from '@/lib/routes';

const CreateTripPage = () => {
  const mutation = useCreateTrip();
  const navigate = useNavigate();
  const [savedTrip, setSavedTrip] = useState<Trip | null>(null);

  const handleSubmit = (values: CreateTripValues) => {
    const { name, arriveBy, destination } = values;

    if (!destination) {
      return;
    }

    mutation.mutate(
      {
        name,
        arriveBy: new Date(arriveBy).toISOString(),
        destinationPlaceId: destination.id,
      },
      {
        onSuccess: (trip) => {
          setSavedTrip(trip);
        },
      },
    );
  };

  const handleDone = () => {
    setSavedTrip(null);
    void navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-3 pt-4 sm:px-4 sm:pt-6">
      <CreateTripForm
        onSubmit={handleSubmit}
        isSubmitting={mutation.isPending}
        submitError={mutation.error}
      />
      <TripSummaryDialog
        key={savedTrip?.tripId ?? 'none'}
        open={savedTrip !== null}
        trip={savedTrip}
        onDone={handleDone}
      />
    </main>
  );
};

export default CreateTripPage;
