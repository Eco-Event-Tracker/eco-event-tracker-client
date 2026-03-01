import { PageSection } from '../components/ui/PageSection';
import { usePageTitle } from '../hooks/usePageTitle';

export function CreateEventPage() {
  usePageTitle('Create Event');

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-100">Create Event</h1>
        <p className="mt-2 text-sm text-zinc-400">
          One page with two sections: event metadata and emission data.
        </p>
      </header>

      <PageSection title="Event Metadata" description="Title, location, and date inputs will be added in Phase 2.">
        <div className="rounded-2xl border border-dashed border-zinc-700 p-4 text-sm text-zinc-400">Form controls pending.</div>
      </PageSection>

      <PageSection
        title="Emission Data"
        description="Attendance, energy, travel, catering, and waste inputs will be added in Phase 2."
      >
        <div className="rounded-2xl border border-dashed border-zinc-700 p-4 text-sm text-zinc-400">Form controls pending.</div>
      </PageSection>

      <button
        type="button"
        className="rounded-2xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200"
        disabled
      >
        Generate emission breakdown reports
      </button>
    </div>
  );
}
