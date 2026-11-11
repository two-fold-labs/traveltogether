const METERS_PER_KM = 1000;
const WHOLE_KM_THRESHOLD = 100;

const kmFormatters = {
  decimal: new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }),
  whole: new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }),
};

const formatDistance = (distanceInMeters: number): string => {
  if (!Number.isFinite(distanceInMeters) || distanceInMeters < 0) {
    return '';
  }

  const meters = Math.round(distanceInMeters);

  if (meters < METERS_PER_KM) {
    return `${meters} m`;
  }

  const km = meters / METERS_PER_KM;
  const formatter =
    km < WHOLE_KM_THRESHOLD ? kmFormatters.decimal : kmFormatters.whole;

  return `${formatter.format(km)} km`;
};

export { formatDistance };
