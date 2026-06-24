import { useCallback, useEffect, useState } from 'react';
import { deleteEvent as deleteEventApi, listEvents } from '../api/events';
import type { EventSummary } from '../types/events';
import { useAuth } from './useAuth';

interface UseEventsResult {
  events: EventSummary[];
  isLoading: boolean;
  error: string;
  refetch: () => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
}

export function useEvents(): UseEventsResult {
  const { session } = useAuth();
  const userId = session?.user.id ?? '';

  const [events, setEvents] = useState<EventSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEvents = useCallback(async () => {
    if (!userId) {
      setEvents([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      setEvents(await listEvents(userId));
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load events.');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  const removeEvent = useCallback(
    async (id: string) => {
      if (!userId) {
        return;
      }

      const previous = events;
      setError('');
      setEvents((current) => current.filter((event) => event.id !== id));

      try {
        await deleteEventApi(id, userId);
      } catch (deleteError) {
        setEvents(previous);
        setError(deleteError instanceof Error ? deleteError.message : 'Failed to remove event.');
      }
    },
    [userId, events]
  );

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
    removeEvent
  };
}
