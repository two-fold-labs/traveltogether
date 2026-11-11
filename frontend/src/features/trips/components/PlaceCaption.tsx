import Typography from '@mui/material/Typography';

import { formatDistance } from '@/lib/formatDistance';

import type { PlaceSuggestion } from '../types';

interface PlaceCaptionProps {
  place: PlaceSuggestion;
}

// Address truncates; the distance never shrinks so it always stays visible
const PlaceCaption = ({ place }: PlaceCaptionProps) => {
  const distance =
    typeof place.distanceMeters === 'number'
      ? formatDistance(place.distanceMeters)
      : '';

  if (!place.address && !distance) {
    return null;
  }

  return (
    <Typography
      variant="caption"
      color="text.secondary"
      component="div"
      className="flex min-w-0 font-normal"
    >
      {place.address && <span className="truncate">{place.address}</span>}
      {place.address && distance && <span className="shrink-0 px-1">•</span>}
      {distance && (
        <span className="shrink-0 whitespace-nowrap">{distance}</span>
      )}
    </Typography>
  );
};

export default PlaceCaption;
