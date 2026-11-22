import {
  AdvancedMarker,
  Pin,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';

import { mixColor } from '../../utils/colorVariants';
import type { LatLngLike } from './LocationMap';
import PersonInfoWindow from './PersonInfoWindow';

export type PersonMarker = {
  id: string;
  name: string;
  position: LatLngLike;
  avatarUrl?: string;
  lastUpdated?: string;
  color?: string;
};

interface PersonMarkerProps {
  person: PersonMarker;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onInfoWindowClose: () => void;
}

const PersonMarker = ({
  person,
  isActive,
  isHovered,
  onClick,
  onHoverStart,
  onHoverEnd,
  onInfoWindowClose,
}: PersonMarkerProps) => {
  const color = person.color ?? '#0f9d58';
  const background = color;
  const borderColor = mixColor(color, -32);
  const glyphColor = mixColor(color, 80);

  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={person.position}
        title={person.name}
        onClick={onClick}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        <Pin
          background={background}
          borderColor={borderColor}
          glyphColor={glyphColor}
          glyphText={person.name[0].toUpperCase()}
          scale={isActive || isHovered ? 1.2 : 1}
        />
      </AdvancedMarker>

      {(isActive || isHovered) && (
        <PersonInfoWindow
          anchor={marker}
          key={person.id}
          person={person}
          onClose={onInfoWindowClose}
          variant="active"
        />
      )}
    </>
  );
};

export default PersonMarker;
