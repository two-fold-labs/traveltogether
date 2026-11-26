import ErrorState, { type ErrorStateProps } from '@/components/ui/ErrorState';

type ErrorPageProps = Omit<ErrorStateProps, 'size' | 'className'>;

// Full-screen error for failures that block the whole app, such as the session
const ErrorPage = (props: ErrorPageProps) => (
  <ErrorState
    {...props}
    size="page"
    className="h-dvh w-full justify-center bg-background px-4"
  />
);

export default ErrorPage;
