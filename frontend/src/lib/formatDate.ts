// Formatters use the browser's locale (`undefined`).
type DateInput = string | Date | null | undefined;

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const relativeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
});

const toDate = (value: DateInput): Date | null => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

// "Sat, Nov 14, 9:00 AM". Returns '' for a missing or invalid date.
const formatDateTime = (value: DateInput): string => {
  const date = toDate(value);

  return date ? dateTimeFormatter.format(date) : '';
};

// "in 3 days", "tomorrow", "5 hours ago". Returns '' for a missing or invalid date.
const formatRelativeTime = (value: DateInput, now = new Date()): string => {
  const date = toDate(value);

  if (!date) {
    return '';
  }

  const diff = date.getTime() - now.getTime();

  if (Math.abs(diff) >= MS_PER_DAY) {
    return relativeFormatter.format(Math.round(diff / MS_PER_DAY), 'day');
  }

  if (Math.abs(diff) >= MS_PER_HOUR) {
    return relativeFormatter.format(Math.round(diff / MS_PER_HOUR), 'hour');
  }

  return relativeFormatter.format(Math.round(diff / MS_PER_MINUTE), 'minute');
};

export { formatDateTime, formatRelativeTime };
