import GlobalStyles from '@mui/material/GlobalStyles';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APIProvider } from '@vis.gl/react-google-maps';

import theme from '../theme/theme';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface AppProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <ThemeProvider theme={theme}>
          <APIProvider apiKey={apiKey}>{children}</APIProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
