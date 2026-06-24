import type { CreateEventRequest } from '../types/events';
import type { EstimateInput } from '../types/estimate';
import { countPeople, type PlannerValues, toEstimateInput } from './planner';

export interface EventMetadataValues {
  title: string;
  location: string;
  eventDate: string;
}

export type EventMetadataErrors = Partial<Record<keyof EventMetadataValues, string>>;

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getInitialEventMetadata(): EventMetadataValues {
  return {
    title: '',
    location: '',
    eventDate: todayIsoDate()
  };
}

export function validateEventMetadata(values: EventMetadataValues): EventMetadataErrors {
  const errors: EventMetadataErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required.';
  }

  if (!values.location.trim()) {
    errors.location = 'Location is required.';
  }

  if (!values.eventDate || Number.isNaN(Date.parse(values.eventDate))) {
    errors.eventDate = 'Date must be valid.';
  }

  return errors;
}

export function hasEventMetadataErrors(errors: EventMetadataErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function toCreateEventPayload(
  metadata: EventMetadataValues,
  plannerValues: PlannerValues
): CreateEventRequest {
  return {
    title: metadata.title.trim(),
    location: metadata.location.trim(),
    event_date: metadata.eventDate,
    plan: toEstimateInput(plannerValues)
  };
}

export function canSaveEvent(plan: EstimateInput): boolean {
  return countPeople(plan) > 0;
}
