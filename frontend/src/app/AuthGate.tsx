import type { ReactNode } from 'react';

import ErrorPage from '@/components/ui/ErrorPage';
import Loader from '@/components/ui/Loader';
import { useSession } from '@/features/auth';

interface AuthGateProps {
  children: ReactNode;
}

const AuthGate = ({ children }: AuthGateProps) => {
  const { isPending, isError, isFetching, refetch } = useSession();

  if (isPending) {
    return <Loader label="Starting your session" />;
  }

  if (isError) {
    return (
      <ErrorPage
        title="Can't start your session"
        message="We couldn't reach Trip Sync. Check your connection and try again."
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  return <>{children}</>;
};

export default AuthGate;
