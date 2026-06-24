import { Link } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';

const MAX_PILLS = 5;

/** Compact strip of recent saved events shown above the record form, with a link to the full dashboard. */
export function RecentEventPills() {
  const { events, isLoading } = useEvents();

  if (isLoading || events.length === 0) {
    return null;
  }

  const pills = events.slice(0, MAX_PILLS);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Recent</span>
      {pills.map((event) => (
        <Link
          key={event.id}
          to={`/events/${event.id}`}
          className="max-w-[14rem] truncate rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100"
          title={event.title}
        >
          {event.title}
        </Link>
      ))}
      <Link
        to="/dashboard"
        className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 transition-colors hover:bg-emerald-500/20"
      >
        View all →
      </Link>
    </div>
  );
}
