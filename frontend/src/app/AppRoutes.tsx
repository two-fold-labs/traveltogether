import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import App from '@/App';
import { ROUTES } from '@/lib/routes';
import CreateTripPage from '@/pages/CreateTripPage';
import HomePage from '@/pages/HomePage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="create-trip" element={<CreateTripPage />} />
        </Route>

        {/* Catch-all route redirecting to home */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
