import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link } from 'react-router';

import DarkModeButton from '@/components/ui/DarkModeButton';
import Logo from '@/components/ui/Logo';
import { JoinTripButton, CreateTripButton } from '@/features/trips';
import { ROUTES } from '@/lib/routes';

import LocationShareButton from './LocationShareButton';

const Header = () => (
  <AppBar component="header">
    <Toolbar
      disableGutters
      className="mx-auto w-full max-w-4xl justify-between gap-2 px-3 sm:px-4"
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Link to={ROUTES.HOME}>
          <Logo />
        </Link>
        <div className="border-l border-border pl-2">
          <LocationShareButton />
        </div>
      </div>

      <nav
        aria-label="Primary"
        className="flex shrink-0 items-center gap-1.5 sm:gap-2"
      >
        <JoinTripButton />
        <CreateTripButton />
        <DarkModeButton />
      </nav>
    </Toolbar>
  </AppBar>
);

export default Header;
