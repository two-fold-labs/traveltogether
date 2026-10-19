import { Outlet } from 'react-router';

import Header from './components/layout/header/Header';



function App() {
  return (
    <>
      <div className="flex h-dvh flex-col">
        <Header />
        <Outlet />
      </div>
      {/* <Grid
          container
          component="main"
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{
            minHeight: "100dvh",
            justifyContent: "center",
            boxSizing: "border-box",
            p: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <Grid size={{ xs: 4, sm: 8, md: 12 }}>
            <LocationHeader />
          </Grid>

          <Grid size={{ xs: 4, sm: 6, md: 6 }}>
            <LocationShare />
          </Grid>
        </Grid> */}
    </>
  );
}

export default App;
