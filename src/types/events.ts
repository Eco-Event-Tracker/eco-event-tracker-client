import type { EstimateInput, EstimateResult } from './estimate';

export interface CreateEventRequest {
  title: string;
  location: string;
  event_date: string;
  plan: EstimateInput;
}

export interface CreateEventResponse {
  id: string;
  title: string;
  location: string;
  event_date: string;
  participant_count: number;
  is_virtual: boolean;
  estimated_co2: number;
}

export interface EventDetailsResponse {
  title: string;
  location: string;
  event_date: string;
  plan: EstimateInput;
  estimate: EstimateResult;
}

export type ReportFormat = 'csv' | 'pdf';

export interface ApiErrorResponse {
  message?: string;
}

export interface RecentEventItem {
  id: string;
  title: string;
  location: string;
  event_date: string;
  total_co2?: number;
  saved_at: string;
}
