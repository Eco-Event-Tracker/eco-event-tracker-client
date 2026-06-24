import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { PageSection } from '../components/ui/PageSection';
import { useEvents } from '../hooks/useEvents';
import { formatDate, formatKg } from '../utils/format';

export function DashboardPage() {
  usePageTitle('Dashboard');
  const { events, isLoading, error, refetch, removeEvent } = useEvents();

  return (
    <div className="space-y-6">
      <PageSection title="Dashboard" description="Create and manage event records.">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-400">
              Your saved events, stored on your account and available on any device.
            </p>
            {error ? (
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-2xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200"
              >
                Retry
              </button>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 p-4 text-sm text-zinc-400">
              Loading your events...
            </div>
          ) : events.length === 0 && !error ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 p-4 text-sm text-zinc-400">
              No events saved yet.{' '}
              <Link to="/events/new" className="text-emerald-300 hover:text-emerald-200">
                Record a past event
              </Link>{' '}
              to start tracking.
            </div>
          ) : (
            <ul className="space-y-3">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-zinc-100">{event.title}</h3>
                        {event.category ? (
                          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                            {event.category}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">
                        {event.location} • {formatDate(event.event_date)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300">
                      Total: {typeof event.estimated_co2 === 'number' ? formatKg(event.estimated_co2) : 'Pending'}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      to={`/events/${event.id}`}
                      className="rounded-2xl border border-zinc-700 bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-950"
                    >
                      Open details
                    </Link>
                    <button
                      type="button"
                      onClick={() => void removeEvent(event.id)}
                      className="rounded-2xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PageSection>

      <Link
        to="/events/new"
        className="fixed bottom-6 right-6 grid h-14 w-14 place-items-center rounded-3xl border border-zinc-700 bg-zinc-100 text-2xl font-semibold text-zinc-950 shadow-lg shadow-black/40 transition-transform hover:scale-105"
        aria-label="Record event"
      >
        +
      </Link>
    </div>
  );
}
