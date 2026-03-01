import { requestFile, requestJson } from './http';
import type {
  CreateEventRequest,
  CreateEventResponse,
  EventDetailsResponse,
  ReportFormat
} from '../types/events';
import { env } from '../utils/env';

const API_PREFIX = '/api';

function getUserId(userIdOverride?: string): string {
  const userId = userIdOverride || env.apiUserId;
  if (!userId) {
    throw new Error('x-user-id is required. Set VITE_API_USER_ID in your .env file.');
  }
  return userId;
}

export async function createEvent(payload: CreateEventRequest, userIdOverride?: string): Promise<CreateEventResponse> {
  return requestJson<CreateEventResponse>(`${API_PREFIX}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getUserId(userIdOverride)
    },
    body: JSON.stringify(payload)
  });
}

export async function getEventDetails(eventId: string): Promise<EventDetailsResponse> {
  if (!eventId) {
    throw new Error('eventId is required');
  }

  return requestJson<EventDetailsResponse>(`${API_PREFIX}/events/${eventId}`);
}

export async function downloadEventReport(eventId: string, format: ReportFormat = 'csv') {
  if (!eventId) {
    throw new Error('eventId is required');
  }

  const encodedId = encodeURIComponent(eventId);
  return requestFile(`${API_PREFIX}/events/${encodedId}/report?format=${format}`);
}
