import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export function NotFoundPage() {
  usePageTitle('Not Found');

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
      <div className="relative grid h-28 w-28 place-items-center rounded-3xl border border-zinc-700 bg-zinc-950">
        <div className="h-10 w-10 rounded-full border-2 border-zinc-400" />
        <div className="absolute -bottom-2 -right-2 grid h-8 w-8 place-items-center rounded-2xl border border-zinc-700 bg-zinc-900 text-lg text-zinc-300">
          !
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Page not found</h1>
        <p className="mt-2 text-sm text-zinc-400">The route you entered does not exist, or the page has moved.</p>
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
