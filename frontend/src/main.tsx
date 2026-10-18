import GlobalStyles from '@mui/material/GlobalStyles';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import AppRoutes from './app/AppRoutes.tsx';
import AuthGate from './app/AuthGate.tsx';
import theme from './theme/theme.ts';

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <ThemeProvider theme={theme}>
          <AuthGate>
            <AppRoutes />
          </AuthGate>
        </ThemeProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
