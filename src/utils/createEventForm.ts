import type { CreateEventRequest } from '../types/events';

export interface CreateEventFormValues {
  title: string;
  location: string;
  eventDate: string;
  participantCount: string;
  isVirtual: boolean;
  energyKwh: string;
  travelKm: string;
  cateringMeals: string;
  wasteKg: string;
  userId: string;
}

export type CreateEventFormErrors = Partial<Record<keyof CreateEventFormValues, string>>;

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getInitialCreateEventFormValues(defaultUserId = ''): CreateEventFormValues {
  return {
    title: '',
    location: '',
    eventDate: todayIsoDate(),
    participantCount: '0',
    isVirtual: false,
    energyKwh: '0',
    travelKm: '0',
    cateringMeals: '0',
    wasteKg: '0',
    userId: defaultUserId
  };
}

function isIntegerString(input: string): boolean {
  return /^\d+$/.test(input.trim());
}

function isNonNegativeNumber(input: string): boolean {
  const parsed = Number(input);
  return Number.isFinite(parsed) && parsed >= 0;
}

export function validateCreateEventForm(values: CreateEventFormValues): CreateEventFormErrors {
  const errors: CreateEventFormErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Title is required.';
  }

  if (!values.location.trim()) {
    errors.location = 'Location is required.';
  }

  if (!values.eventDate || Number.isNaN(Date.parse(values.eventDate))) {
    errors.eventDate = 'Date must be valid.';
  }

  if (!isIntegerString(values.participantCount)) {
    errors.participantCount = 'Attendance must be a non-negative integer.';
  }

  if (!isNonNegativeNumber(values.energyKwh)) {
    errors.energyKwh = 'Energy usage must be a non-negative number.';
  }

  if (!isNonNegativeNumber(values.travelKm)) {
    errors.travelKm = 'Travel data must be a non-negative number.';
  }

  if (!isIntegerString(values.cateringMeals)) {
    errors.cateringMeals = 'Catering meals must be a non-negative integer.';
  }

  if (!isNonNegativeNumber(values.wasteKg)) {
    errors.wasteKg = 'Waste must be a non-negative number.';
  }

  return errors;
}

export function hasCreateEventErrors(errors: CreateEventFormErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function toCreateEventPayload(values: CreateEventFormValues): CreateEventRequest {
  const participantCount = Number(values.participantCount);

  return {
    title: values.title.trim(),
    location: values.location.trim(),
    event_date: values.eventDate,
    participant_count: participantCount,
    attendance_count: participantCount,
    is_virtual: values.isVirtual,
    energy_kwh: Number(values.energyKwh),
    travel_km: Number(values.travelKm),
    catering_meals: Number(values.cateringMeals),
    waste_kg: Number(values.wasteKg)
  };
}
