export interface CreateEventRequest {
  title: string;
  location: string;
  event_date: string;
  participant_count: number;
  attendance_count?: number;
  is_virtual: boolean;
  energy_kwh: number;
  travel_km: number;
  catering_meals: number;
  waste_kg: number;
}

export interface CreateEventResponse {
  id: string;
  title: string;
  location: string;
  event_date: string;
  participant_count: number;
  is_virtual: boolean;
  emission_data: {
    energy_kwh: number;
    travel_km: number;
    catering_meals: number;
    waste_kg: number;
    total_co2: number;
  };
}

export interface EventDetailsResponse {
  title: string;
  location: string;
  event_date: string;
  participant_count: number;
  is_virtual: boolean;
  total_co2: number;
  breakdown: {
    energy: number;
    travel: number;
    catering: number;
    waste: number;
  };
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
