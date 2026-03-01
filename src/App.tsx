import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { CreateEventPage } from './pages/CreateEventPage';
import { DashboardPage } from './pages/DashboardPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/events/new" element={<CreateEventPage />} />
        <Route path="/events/:eventId" element={<EventDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
