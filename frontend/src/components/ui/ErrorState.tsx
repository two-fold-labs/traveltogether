import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Icon } from '@/components/ui/Icon';

type ErrorStateSize = 'section' | 'page';

// page: fills the screen (app-level failures). section: replaces one part of
// a page, such as a list whose query failed.
const SIZE_STYLES = {
  section: {
    container: 'rounded-3xl border border-border bg-card p-6',
    icon: 'text-3xl',
    titleVariant: 'h6',
    titleComponent: 'h3',
    buttonVariant: 'outlined',
  },
  page: {
    container: '',
    icon: 'text-4xl',
    titleVariant: 'h4',
    titleComponent: 'h1',
    buttonVariant: 'contained',
  },
} as const;

export interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  size?: ErrorStateSize;
  className?: string;
}

const ErrorState = ({
  title,
  message,
  onRetry,
  isRetrying = false,
  size = 'section',
  className = '',
}: ErrorStateProps) => {
  const styles = SIZE_STYLES[size];

  return (
    <Stack
      role="alert"
      spacing={3}
      className={`items-center text-center ${styles.container} ${className}`}
    >
      <Icon name="circleXmark" className={`${styles.icon} text-danger`} />
      <Stack spacing={1} className="max-w-md items-center">
        <Typography
          variant={styles.titleVariant}
          component={styles.titleComponent}
        >
          {title}
        </Typography>
        <Typography color="text.secondary">{message}</Typography>
      </Stack>
      {onRetry && (
        <Button
          variant={styles.buttonVariant}
          onClick={onRetry}
          disabled={isRetrying}
          startIcon={<Icon name="rotateRight" />}
        >
          {isRetrying ? 'Retrying…' : 'Try again'}
        </Button>
      )}
    </Stack>
  );
};

export default ErrorState;
