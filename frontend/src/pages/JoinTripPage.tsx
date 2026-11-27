import { useParams } from 'react-router';

import { JoinInvite } from '@/features/trips';

const JoinTripPage = () => {
  const { tripId } = useParams();

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col overflow-y-auto px-3 py-4 sm:px-4 sm:py-6">
      <JoinInvite tripId={tripId} />
    </main>
  );
};

export default JoinTripPage;
