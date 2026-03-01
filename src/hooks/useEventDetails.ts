import { useCallback, useEffect, useState } from 'react';
import { getEventDetails } from '../api/events';
import type { EventDetailsResponse } from '../types/events';

interface UseEventDetailsResult {
  eventDetails: EventDetailsResponse | null;
  isLoading: boolean;
  error: string;
  refetch: () => Promise<void>;
}

export function useEventDetails(eventId: string): UseEventDetailsResult {
  const [eventDetails, setEventDetails] = useState<EventDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDetails = useCallback(async () => {
    if (!eventId) {
      setEventDetails(null);
      setError('Invalid event id.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await getEventDetails(eventId);
      setEventDetails(data);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Failed to load event details.';
      setError(message);
      setEventDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void fetchDetails();
  }, [fetchDetails]);

  return {
    eventDetails,
    isLoading,
    error,
    refetch: fetchDetails
  };
}
