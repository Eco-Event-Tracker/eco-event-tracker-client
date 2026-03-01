import { Link, useLocation } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function AppShell({ children }: PropsWithChildren) {
  const location = useLocation();
  const { isAuthenticated, session, logout } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-200">
            EcoEvent Tracker
          </Link>
          {isAuthenticated ? (
            <div className="flex flex-wrap items-center gap-3">
              <nav className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
                <Link
                  to="/"
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                    location.pathname === '/' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/events/new"
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                    location.pathname === '/events/new' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  Create Event
                </Link>
              </nav>
              <div className="flex items-center gap-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300">
                  {session?.user.email}
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-2xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <nav className="flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
              <Link
                to="/login"
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  location.pathname === '/login' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  location.pathname === '/signup' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                Signup
              </Link>
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
