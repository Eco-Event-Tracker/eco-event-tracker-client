import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FormField } from '../components/ui/FormField';
import { PageSection } from '../components/ui/PageSection';
import { useAuth } from '../hooks/useAuth';
import { usePageTitle } from '../hooks/usePageTitle';

const inputClassName =
  'w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-500';

interface LocationState {
  from?: string;
}

export function LoginPage() {
  const { isAuthenticated, loginWithPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  usePageTitle('Login');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const from = ((location.state as LocationState | null)?.from || '/') as string;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setSubmitError('Email and password are required.');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      await loginWithPassword(email.trim(), password);
      navigate(from, { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-100">Login</h1>
        <p className="mt-2 text-sm text-zinc-400">Sign in to create and manage events.</p>
      </header>

      <form onSubmit={onSubmit}>
        <PageSection title="Account" description="Use your existing EcoEvent Tracker account.">
          <div className="space-y-4">
            <FormField label="Email" htmlFor="loginEmail">
              <input
                id="loginEmail"
                type="email"
                className={inputClassName}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </FormField>

            <FormField label="Password" htmlFor="loginPassword">
              <input
                id="loginPassword"
                type="password"
                className={inputClassName}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </FormField>

            {submitError ? (
              <div className="rounded-2xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </div>
        </PageSection>
      </form>

      <p className="text-center text-sm text-zinc-400">
        No account yet?{' '}
        <Link to="/signup" className="font-medium text-zinc-100 underline decoration-zinc-600 underline-offset-4">
          Create one
        </Link>
      </p>
    </div>
  );
}
