import type { RecentEventItem } from '../types/events';

const STORAGE_KEY = 'eco-event-tracker:recent-events';
const MAX_ITEMS = 12;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage;
}

function parseStoredEvents(raw: string | null): RecentEventItem[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is RecentEventItem => {
      return Boolean(
        item &&
          typeof item === 'object' &&
          typeof (item as RecentEventItem).id === 'string' &&
          typeof (item as RecentEventItem).title === 'string' &&
          typeof (item as RecentEventItem).location === 'string' &&
          typeof (item as RecentEventItem).event_date === 'string' &&
          typeof (item as RecentEventItem).saved_at === 'string'
      );
    });
  } catch {
    return [];
  }
}

function sortByNewest(items: RecentEventItem[]): RecentEventItem[] {
  return [...items].sort((a, b) => Date.parse(b.saved_at) - Date.parse(a.saved_at));
}

export function getRecentEvents(): RecentEventItem[] {
  if (!isBrowser()) {
    return [];
  }

  return parseStoredEvents(window.localStorage.getItem(STORAGE_KEY));
}

export function saveRecentEvents(items: RecentEventItem[]): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sortByNewest(items).slice(0, MAX_ITEMS)));
}

export function upsertRecentEvent(item: Omit<RecentEventItem, 'saved_at'>): RecentEventItem[] {
  const current = getRecentEvents().filter((existing) => existing.id !== item.id);
  const next: RecentEventItem[] = [
    {
      ...item,
      saved_at: new Date().toISOString()
    },
    ...current
  ];

  saveRecentEvents(next);
  return next;
}

export function removeRecentEvent(id: string): RecentEventItem[] {
  const next = getRecentEvents().filter((item) => item.id !== id);
  saveRecentEvents(next);
  return next;
}

export function clearRecentEvents(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
