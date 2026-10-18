import { CreateTripForm } from '@/features/trips';

const CreateTripPage = () => (
  <main className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-3 pt-4 sm:px-4 sm:pt-6">
    <CreateTripForm onSubmit={() => undefined} />
  </main>
);

export default CreateTripPage;
