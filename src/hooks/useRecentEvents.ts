import { useState } from 'react';
import type { RecentEventItem } from '../types/events';
import {
  clearRecentEvents,
  getRecentEvents,
  removeRecentEvent,
  upsertRecentEvent
} from '../utils/recentEvents';

interface SaveRecentEventInput {
  id: string;
  title: string;
  location: string;
  event_date: string;
  total_co2?: number;
}

interface UseRecentEventsResult {
  recentEvents: RecentEventItem[];
  saveEvent: (item: SaveRecentEventInput) => void;
  removeEvent: (id: string) => void;
  clearAll: () => void;
}

export function useRecentEvents(): UseRecentEventsResult {
  const [recentEvents, setRecentEvents] = useState<RecentEventItem[]>(() => getRecentEvents());

  const saveEvent = (item: SaveRecentEventInput) => {
    setRecentEvents(upsertRecentEvent(item));
  };

  const removeEventById = (id: string) => {
    setRecentEvents(removeRecentEvent(id));
  };

  const clearAll = () => {
    clearRecentEvents();
    setRecentEvents([]);
  };

  return {
    recentEvents,
    saveEvent,
    removeEvent: removeEventById,
    clearAll
  };
}
