import { useParams } from 'react-router-dom';
import { PageSection } from '../components/ui/PageSection';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatKg } from '../utils/format';

export function EventDetailsPage() {
  const { eventId = '' } = useParams();

  usePageTitle('Event Details');

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-100">Event Details</h1>
        <p className="mt-2 text-sm text-zinc-400">Event ID: {eventId || 'unknown'}</p>
      </header>

      <PageSection title="Total CO2" description="Live calculation and backend fetch will be added in Phase 3.">
        <p className="text-3xl font-bold text-zinc-50">{formatKg(0)}</p>
      </PageSection>

      <PageSection title="Breakdown" description="Category visualization will be added later.">
        <ul className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
          <li className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">Energy: {formatKg(0)}</li>
          <li className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">Travel: {formatKg(0)}</li>
          <li className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">Catering: {formatKg(0)}</li>
          <li className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">Waste: {formatKg(0)}</li>
        </ul>
      </PageSection>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-2xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200"
          disabled
        >
          Download Report (CSV)
        </button>
        <button
          type="button"
          className="rounded-2xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200"
          disabled
        >
          Download Report (PDF)
        </button>
      </div>
    </div>
  );
}
