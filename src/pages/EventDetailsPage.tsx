import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { downloadEventReport } from '../api/events';
import { PageSection } from '../components/ui/PageSection';
import { useEventDetails } from '../hooks/useEventDetails';
import { usePageTitle } from '../hooks/usePageTitle';
import type { ReportFormat } from '../types/events';
import { triggerFileDownload } from '../utils/file';
import { formatDate, formatKg } from '../utils/format';
import { upsertRecentEvent } from '../utils/recentEvents';

export function EventDetailsPage() {
  const { eventId = '' } = useParams();
  const { eventDetails, isLoading, error, refetch } = useEventDetails(eventId);
  const [downloadError, setDownloadError] = useState('');
  const [downloading, setDownloading] = useState<ReportFormat | null>(null);

  usePageTitle('Event Details');

  useEffect(() => {
    if (!eventDetails || !eventId) {
      return;
    }

    upsertRecentEvent({
      id: eventId,
      title: eventDetails.title,
      location: eventDetails.location,
      event_date: eventDetails.event_date,
      total_co2: eventDetails.total_co2
    });
  }, [eventDetails, eventId]);

  const handleDownload = async (format: ReportFormat) => {
    if (!eventId) {
      return;
    }

    setDownloadError('');
    setDownloading(format);
    try {
      const report = await downloadEventReport(eventId, format);
      triggerFileDownload(report.blob, report.filename);
    } catch (downloadRequestError) {
      const message =
        downloadRequestError instanceof Error ? downloadRequestError.message : 'Failed to download report.';
      setDownloadError(message);
    } finally {
      setDownloading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-100" />
        <p className="text-sm text-zinc-300">Loading event details...</p>
      </div>
    );
  }

  if (error || !eventDetails) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-3xl border border-zinc-700 bg-zinc-950">
          <div className="h-8 w-8 rounded-full border-2 border-zinc-500" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Something went wrong</h1>
          <p className="mt-2 text-sm text-zinc-400">{error || 'Event details are unavailable.'}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-2xl border border-zinc-700 bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950"
          >
            Retry
          </button>
          <Link
            to="/"
            className="rounded-2xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-100">{eventDetails.title}</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {eventDetails.location} • {formatDate(eventDetails.event_date)} •{' '}
          {eventDetails.is_virtual ? 'Virtual' : 'In-person'} • {eventDetails.participant_count} participants
        </p>
        <p className="mt-1 text-xs text-zinc-500">Event ID: {eventId || 'unknown'}</p>
      </header>

      <PageSection title="Total CO2" description="Automatically calculated from event emission data.">
        <p className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl">{formatKg(eventDetails.total_co2)}</p>
      </PageSection>

      <PageSection title="Breakdown" description="Emission by category. Chart view is intentionally left for a later phase.">
        <ul className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
          <li className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">Energy: {formatKg(eventDetails.breakdown.energy)}</li>
          <li className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">Travel: {formatKg(eventDetails.breakdown.travel)}</li>
          <li className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">Catering: {formatKg(eventDetails.breakdown.catering)}</li>
          <li className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">Waste: {formatKg(eventDetails.breakdown.waste)}</li>
        </ul>
      </PageSection>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void handleDownload('csv')}
          className="rounded-2xl border border-zinc-700 bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
          disabled={downloading !== null}
        >
          {downloading === 'csv' ? 'Downloading CSV...' : 'Download Report (CSV)'}
        </button>
        <button
          type="button"
          onClick={() => void handleDownload('pdf')}
          className="rounded-2xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={downloading !== null}
        >
          {downloading === 'pdf' ? 'Downloading PDF...' : 'Download Report (PDF)'}
        </button>
      </div>

      {downloadError ? (
        <div className="rounded-2xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-200">{downloadError}</div>
      ) : null}
    </div>
  );
}
