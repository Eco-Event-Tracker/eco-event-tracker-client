import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { downloadEventReport } from '../api/events';
import { PlannerFootprintPanel } from '../components/planner/PlannerFootprintPanel';
import { PlannerInsights } from '../components/planner/PlannerInsights';
import { useEventDetails } from '../hooks/useEventDetails';
import { usePageTitle } from '../hooks/usePageTitle';
import type { ReportFormat } from '../types/events';
import { triggerFileDownload } from '../utils/file';
import { formatDate } from '../utils/format';
import { countPeople } from '../utils/planner';
import { upsertRecentEvent } from '../utils/recentEvents';

function formatLabel(format: string): string {
  switch (format) {
    case 'in_person':
      return 'In person';
    case 'hybrid':
      return 'Hybrid';
    case 'virtual':
      return 'Virtual';
    default:
      return format;
  }
}

export function EventDetailsPage() {
  const { eventId = '' } = useParams();
  const { eventDetails, isLoading, error, refetch } = useEventDetails(eventId);
  const [downloadError, setDownloadError] = useState('');
  const [downloading, setDownloading] = useState<ReportFormat | null>(null);

  usePageTitle('Event Details');

  const totalPeople = useMemo(
    () => (eventDetails ? countPeople(eventDetails.plan) : 0),
    [eventDetails]
  );

  useEffect(() => {
    if (!eventDetails || !eventId) {
      return;
    }

    upsertRecentEvent({
      id: eventId,
      title: eventDetails.title,
      location: eventDetails.location,
      event_date: eventDetails.event_date,
      total_co2: eventDetails.estimate.total
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
            to="/dashboard"
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
          {formatLabel(eventDetails.plan.format)} • {totalPeople} participants
        </p>
      </header>

      <PlannerFootprintPanel result={eventDetails.estimate} totalPeople={totalPeople} showLiveIndicator={false} />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlannerInsights result={eventDetails.estimate} />

        <div className="space-y-4 lg:col-start-2 lg:row-start-1">
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
            <div className="rounded-2xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {downloadError}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
