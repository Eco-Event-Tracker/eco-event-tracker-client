import { env } from './env';

function hasApiSuffix(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.pathname.replace(/\/+$/, '').endsWith('/api');
  } catch {
    return value.replace(/\/+$/, '').endsWith('/api');
  }
}

const API_PREFIX = hasApiSuffix(env.apiBaseUrl) ? '' : '/api';

export function apiPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_PREFIX}${normalized}`;
}
