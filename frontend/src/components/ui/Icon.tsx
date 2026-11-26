import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faRoute,
  faCompass,
  faClock,
  faTree,
  faWater,
  faWineGlass,
  faUmbrellaBeach,
  faCity,
  faPlane,
  faFish,
  faDice,
  faHouse,
  faCircleXmark,
  faFlagCheckered,
  faArrowLeft,
  faRotateRight,
  faLocationDot,
  faPaperPlane,
  faPenNib,
  faPlus,
  faSun,
  faMoon,
  faRightToBracket,
  faLocationCrosshairs,
  faSuitcaseRolling,
  faAngleRight,
  faCrown,
  faUserGroup,
  faCalendarCheck,
  faEye,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';

const icons = {
  route: faRoute,
  compass: faCompass,
  clock: faClock,
  tree: faTree,
  water: faWater,
  wineGlass: faWineGlass,
  umbrellaBeach: faUmbrellaBeach,
  city: faCity,
  plane: faPlane,
  fish: faFish,
  dice: faDice,
  house: faHouse,
  circleXmark: faCircleXmark,
  flagCheckered: faFlagCheckered,
  arrowLeft: faArrowLeft,
  rotateRight: faRotateRight,
  locationDot: faLocationDot,
  paperPlane: faPaperPlane,
  penNib: faPenNib,
  plus: faPlus,
  sun: faSun,
  moon: faMoon,
  rightToBracket: faRightToBracket,
  locationCrosshairs: faLocationCrosshairs,
  suitcaseRolling: faSuitcaseRolling,
  angleRight: faAngleRight,
  crown: faCrown,
  userGroup: faUserGroup,
  calendarCheck: faCalendarCheck,
  eye: faEye,
  penToSquare: faPenToSquare,
  // ...rest
} as const satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof icons;

interface IconProps extends Omit<FontAwesomeIconProps, 'icon'> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  return <FontAwesomeIcon icon={icons[name]} {...props} />;
}
