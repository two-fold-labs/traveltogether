import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { InfoWindow } from '@vis.gl/react-google-maps';

import formatLastUpdated from '../../utils/formatLastUpdated';
import type { PersonMarker } from './PersonMarker';

type PersonInfoWindowProps = {
  person: PersonMarker;
  onClose: () => void;
  anchor: google.maps.marker.AdvancedMarkerElement | null;
  variant?: 'active' | 'hover';
};

export default function PersonInfoWindow({
  person,
  onClose,
  anchor,
}: PersonInfoWindowProps) {
  return (
    <InfoWindow
      anchor={anchor}
      headerDisabled
      onClose={onClose}
      style={{ padding: 0 }}
      maxWidth={160}
    >
      <Grid container spacing={1}>
        <Grid
          size={12}
          container
          sx={{
            alignItems: 'center',
          }}
          spacing={1}
        >
          <Grid>
            {person.avatarUrl ? (
              <img
                src={person.avatarUrl}
                alt={person.name}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Grid
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: person.color ?? 'primary.main',
                  color: 'common.white',
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                {person.name.charAt(0).toUpperCase()}
              </Grid>
            )}
          </Grid>
          <Grid>
            <strong>{person.name}</strong>
          </Grid>
        </Grid>
        <Grid>
          <Typography component="span" variant="caption">
            Last updated: {formatLastUpdated(person.lastUpdated)}
          </Typography>
        </Grid>
      </Grid>
    </InfoWindow>
  );
}
