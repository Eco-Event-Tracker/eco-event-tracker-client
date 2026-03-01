import type { AuthSession } from '../types/auth';

const STORAGE_KEY = 'eco-event-tracker:auth-session';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && !!window.sessionStorage;
}

function isValidSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const session = value as AuthSession;

  return Boolean(
    typeof session.token === 'string' &&
      session.token &&
      session.user &&
      typeof session.user.id === 'string' &&
      typeof session.user.name === 'string' &&
      typeof session.user.email === 'string' &&
      typeof session.user.role === 'string'
  );
}

export function getAuthSession(): AuthSession | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return isValidSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession): void {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}
