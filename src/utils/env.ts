const DEFAULT_API_BASE_URL = 'http://localhost:3000';

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function parseTimeout(input: string | undefined): number {
  const parsed = Number(input);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 10000;
  }
  return parsed;
}

export const env = {
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL),
  apiUserId: import.meta.env.VITE_API_USER_ID || '',
  apiTimeoutMs: parseTimeout(import.meta.env.VITE_API_TIMEOUT_MS)
};
