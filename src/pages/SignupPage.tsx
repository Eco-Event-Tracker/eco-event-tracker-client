import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FormField } from '../components/ui/FormField';
import { PageSection } from '../components/ui/PageSection';
import { useAuth } from '../hooks/useAuth.ts';
import { usePageTitle } from '../hooks/usePageTitle';

const inputClassName =
  'w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-500';

export function SignupPage() {
  const { isAuthenticated, signupWithPassword } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  usePageTitle('Signup');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setSubmitError('Name, email, and password are required.');
      return;
    }

    if (password.length < 6) {
      setSubmitError('Password must be at least 6 characters.');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      await signupWithPassword(name.trim(), email.trim(), password);
      navigate('/', { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-100">Create account</h1>
        <p className="mt-2 text-sm text-zinc-400">Sign up and start tracking event emissions.</p>
      </header>

      <form onSubmit={onSubmit}>
        <PageSection title="New Account" description="Your account will be used for event ownership.">
          <div className="space-y-4">
            <FormField label="Name" htmlFor="signupName">
              <input
                id="signupName"
                className={inputClassName}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Event Organizer"
              />
            </FormField>

            <FormField label="Email" htmlFor="signupEmail">
              <input
                id="signupEmail"
                type="email"
                className={inputClassName}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </FormField>

            <FormField label="Password" htmlFor="signupPassword">
              <input
                id="signupPassword"
                type="password"
                className={inputClassName}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
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
              {isSubmitting ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </PageSection>
      </form>

      <p className="text-center text-sm text-zinc-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-zinc-100 underline decoration-zinc-600 underline-offset-4">
          Login
        </Link>
      </p>
    </div>
  );
}
