import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { PageSection } from '../components/ui/PageSection';

export function DashboardPage() {
  usePageTitle('Dashboard');

  return (
    <div className="space-y-6">
      <PageSection
        title="Dashboard"
        description="Create and manage event records."
      >
        <p className="text-sm text-zinc-400">
          This is the home workspace. Event list and management widgets will be completed in the next phase.
        </p>
      </PageSection>

      <Link
        to="/events/new"
        className="fixed bottom-6 right-6 grid h-14 w-14 place-items-center rounded-3xl border border-zinc-700 bg-zinc-100 text-2xl font-semibold text-zinc-950 shadow-lg shadow-black/40 transition-transform hover:scale-105"
        aria-label="Create new event"
      >
        +
      </Link>
    </div>
  );
}
