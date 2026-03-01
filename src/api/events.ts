import { requestFile, requestJson } from './http';
import type {
  CreateEventRequest,
  CreateEventResponse,
  EventDetailsResponse,
  ReportFormat
} from '../types/events';
import { env } from '../utils/env';

interface RawCreateEventResponse {
  id: string;
  title: string;
  location: string;
  event_date: string;
  participant_count?: number;
  attendance_count?: number;
  is_virtual?: boolean;
  emission_data?: {
    energy_kwh?: number;
    travel_km?: number;
    catering_meals?: number;
    waste_kg?: number;
    total_co2?: number;
  };
}

interface RawEventDetailsResponse {
  title: string;
  location: string;
  event_date: string;
  participant_count?: number;
  attendance_count?: number;
  is_virtual?: boolean;
  total_co2?: number;
  breakdown?: {
    energy?: number;
    travel?: number;
    catering?: number;
    waste?: number;
  };
}

function hasApiSuffix(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.pathname.replace(/\/+$/, '').endsWith('/api');
  } catch {
    return value.replace(/\/+$/, '').endsWith('/api');
  }
}

const API_PREFIX = hasApiSuffix(env.apiBaseUrl) ? '' : '/api';

function getUserId(userIdOverride?: string): string {
  const userId = userIdOverride || env.apiUserId;
  if (!userId) {
    throw new Error('x-user-id is required. Set VITE_API_USER_ID in your .env file.');
  }
  return userId;
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
    participant_count: asNumber(raw.participant_count ?? raw.attendance_count),
    is_virtual: raw.is_virtual ?? false,
    emission_data: {
      energy_kwh: asNumber(raw.emission_data?.energy_kwh),
      travel_km: asNumber(raw.emission_data?.travel_km),
      catering_meals: asNumber(raw.emission_data?.catering_meals),
      waste_kg: asNumber(raw.emission_data?.waste_kg),
      total_co2: asNumber(raw.emission_data?.total_co2)
    }
  };
}

function normalizeEventDetailsResponse(raw: RawEventDetailsResponse): EventDetailsResponse {
  return {
    title: raw.title,
    location: raw.location,
    event_date: raw.event_date,
    participant_count: asNumber(raw.participant_count ?? raw.attendance_count),
    is_virtual: raw.is_virtual ?? false,
    total_co2: asNumber(raw.total_co2),
    breakdown: {
      energy: asNumber(raw.breakdown?.energy),
      travel: asNumber(raw.breakdown?.travel),
      catering: asNumber(raw.breakdown?.catering),
      waste: asNumber(raw.breakdown?.waste)
    }
  };
}

export async function createEvent(payload: CreateEventRequest, userIdOverride?: string): Promise<CreateEventResponse> {
  const raw = await requestJson<RawCreateEventResponse>(`${API_PREFIX}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getUserId(userIdOverride)
    },
    body: JSON.stringify(payload)
  });

  return normalizeCreateEventResponse(raw);
}

export async function getEventDetails(eventId: string): Promise<EventDetailsResponse> {
  if (!eventId) {
    throw new Error('eventId is required');
  }

  const encodedId = encodeURIComponent(eventId);
  const raw = await requestJson<RawEventDetailsResponse>(`${API_PREFIX}/events/${encodedId}`);
  return normalizeEventDetailsResponse(raw);
}

export async function downloadEventReport(eventId: string, format: ReportFormat = 'csv') {
  if (!eventId) {
    throw new Error('eventId is required');
  }

  const encodedId = encodeURIComponent(eventId);
  return requestFile(`${API_PREFIX}/events/${encodedId}/report?format=${format}`);
}
