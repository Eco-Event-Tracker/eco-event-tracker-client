import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export function NotFoundPage() {
  usePageTitle('Not Found');

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
      <div className="grid h-24 w-24 place-items-center rounded-3xl border border-zinc-700 bg-zinc-950 text-4xl">?</div>
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Page not found</h1>
        <p className="mt-2 text-sm text-zinc-400">The route you entered does not exist.</p>
      </div>
      <Link
        to="/"
        className="rounded-2xl border border-zinc-700 bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
