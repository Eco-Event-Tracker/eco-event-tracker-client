import { requestFile, requestJson } from './http';
import type {
  CreateEventRequest,
  CreateEventResponse,
  EventDetailsResponse,
  EventSummary,
  ReportFormat
} from '../types/events';
import type { EstimateInput, EstimateResult } from '../types/estimate';
import { apiPath } from '../utils/apiPath';

interface RawCreateEventResponse {
  id: string;
  title: string;
  location: string;
  event_date: string;
  participant_count?: number;
  is_virtual?: boolean;
  estimated_co2?: number;
}

interface RawEventDetailsResponse {
  title: string;
  location: string;
  event_date: string;
  plan?: EstimateInput;
  estimate?: EstimateResult;
}

interface RawEventSummary {
  id: string;
  title: string;
  location: string;
  event_date: string;
  participant_count?: number;
  is_virtual?: boolean;
  estimated_co2?: number;
  created_at?: string;
}

interface RawListEventsResponse {
  events?: RawEventSummary[];
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeCreateEventResponse(raw: RawCreateEventResponse): CreateEventResponse {
  return {
    id: raw.id,
    title: raw.title,
    location: raw.location,
    event_date: raw.event_date,
    participant_count: asNumber(raw.participant_count),
    is_virtual: raw.is_virtual ?? false,
    estimated_co2: asNumber(raw.estimated_co2)
  };
}

function normalizeEventSummary(raw: RawEventSummary): EventSummary {
  return {
    id: raw.id,
    title: raw.title,
    location: raw.location,
    event_date: raw.event_date,
    participant_count: asNumber(raw.participant_count),
    is_virtual: raw.is_virtual ?? false,
    estimated_co2: asNumber(raw.estimated_co2),
    created_at: raw.created_at ?? ''
  };
}

function normalizeEventDetailsResponse(raw: RawEventDetailsResponse): EventDetailsResponse {
  if (!raw.plan || !raw.estimate) {
    throw new Error('Event details are missing plan or estimate data.');
  }

  return {
    title: raw.title,
    location: raw.location,
    event_date: raw.event_date,
    plan: raw.plan,
    estimate: raw.estimate
  };
}

export async function createEvent(payload: CreateEventRequest, userId: string): Promise<CreateEventResponse> {
  if (!userId) {
    throw new Error('x-user-id is required.');
  }

  const raw = await requestJson<RawCreateEventResponse>(apiPath('/events'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId
    },
    body: JSON.stringify(payload)
  });

  return normalizeCreateEventResponse(raw);
}

export async function listEvents(userId: string): Promise<EventSummary[]> {
  if (!userId) {
    throw new Error('x-user-id is required.');
  }

  const raw = await requestJson<RawListEventsResponse>(apiPath('/events'), {
    headers: {
      'x-user-id': userId
    }
  });

  return (raw.events ?? []).map(normalizeEventSummary);
}

export async function deleteEvent(eventId: string, userId: string): Promise<void> {
  if (!eventId) {
    throw new Error('eventId is required');
  }
  if (!userId) {
    throw new Error('x-user-id is required.');
  }

  const encodedId = encodeURIComponent(eventId);
  await requestJson<{ id: string }>(apiPath(`/events/${encodedId}`), {
    method: 'DELETE',
    headers: {
      'x-user-id': userId
    }
  });
}

export async function getEventDetails(eventId: string): Promise<EventDetailsResponse> {
  if (!eventId) {
    throw new Error('eventId is required');
  }

  const encodedId = encodeURIComponent(eventId);
  const raw = await requestJson<RawEventDetailsResponse>(apiPath(`/events/${encodedId}`));
  return normalizeEventDetailsResponse(raw);
}

export async function downloadEventReport(eventId: string, format: ReportFormat = 'csv') {
  if (!eventId) {
    throw new Error('eventId is required');
  }

  const encodedId = encodeURIComponent(eventId);
  return requestFile(apiPath(`/events/${encodedId}/report?format=${format}`));
}
