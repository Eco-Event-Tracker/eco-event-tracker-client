import { env } from '../utils/env';
import type { ApiErrorResponse } from '../types/events';

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return null;
  }

  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? env.apiTimeoutMs);

  const apiPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${env.apiBaseUrl}${apiPath}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    const data = await parseJsonSafe<T & ApiErrorResponse>(response);
    if (!response.ok) {
      throw new Error(data?.message || `Request failed (${response.status})`);
    }

    if (data === null) {
      throw new Error('Expected JSON response but none was returned.');
    }

    return data as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function requestFile(path: string, options: RequestOptions = {}): Promise<{ blob: Blob; filename: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? env.apiTimeoutMs);

  const apiPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${env.apiBaseUrl}${apiPath}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    if (!response.ok) {
      const data = await parseJsonSafe<ApiErrorResponse>(response);
      throw new Error(data?.message || `Request failed (${response.status})`);
    }

    const disposition = response.headers.get('content-disposition') || '';
    const fileNameMatch = disposition.match(/filename="?([^";]+)"?/i);
    const filename = fileNameMatch?.[1] || 'report';

    return {
      blob: await response.blob(),
      filename
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
