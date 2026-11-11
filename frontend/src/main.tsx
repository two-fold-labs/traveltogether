import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import AppProviders from './app/AppProviders.tsx';
import AppRoutes from './app/AppRoutes.tsx';
import AuthGate from './app/AuthGate.tsx';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <AuthGate>
        <AppRoutes />
      </AuthGate>
    </AppProviders>
  </StrictMode>,
);
