import { useState } from 'react';
import { Outlet } from 'react-router';

import Header from '@/app/layout/Header';
import { JoinTripDialog, type JoinTripOutletContext } from '@/features/trips';

function App() {
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const onJoinTrip = () => setJoinDialogOpen(true);
  const outletContext: JoinTripOutletContext = { onJoinTrip };

  return (
    <>
      <div className="flex h-dvh flex-col">
        <Header onJoinTrip={onJoinTrip} />
        <Outlet context={outletContext} />
      </div>
      <JoinTripDialog
        open={joinDialogOpen}
        onClose={() => setJoinDialogOpen(false)}
      />
    </>
  );
}

export default App;
