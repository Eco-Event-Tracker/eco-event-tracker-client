import type { EstimateInput, EstimateResult } from './estimate';

export interface EventDetails {
  description?: string;
  category?: string;
}

export interface CreateEventRequest {
  title: string;
  location: string;
  event_date: string;
  plan: EstimateInput;
  details?: EventDetails;
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
  details: EventDetails;
  estimate: EstimateResult;
}

export type ReportFormat = 'csv' | 'pdf';

export interface ApiErrorResponse {
  message?: string;
}

export interface EventSummary {
  id: string;
  title: string;
  location: string;
  event_date: string;
  participant_count: number;
  is_virtual: boolean;
  estimated_co2: number;
  category?: string;
  created_at: string;
}
