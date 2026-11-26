import { formatDateTime } from '@/lib/formatDate';

export default function formatLastUpdated(value?: string) {
  if (!value) {
    return 'Just now';
  }

  return formatDateTime(value) || value;
}
