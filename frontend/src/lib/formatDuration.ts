const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;

// "1h 10m", "2h", "45m", "<1m". Returns '' for a negative or invalid value.
const formatDuration = (durationInSeconds: number): string => {
  if (!Number.isFinite(durationInSeconds) || durationInSeconds < 0) {
    return '';
  }

  const totalMinutes = Math.round(durationInSeconds / SECONDS_PER_MINUTE);

  if (totalMinutes < 1) {
    return '<1m';
  }

  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
};

export { formatDuration };
