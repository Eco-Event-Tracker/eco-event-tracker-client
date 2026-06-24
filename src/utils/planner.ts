import type {
  AudienceReach,
  CateringOption,
  EstimateBreakdown,
  EstimateInput,
  EstimateResult,
  EventFormat,
  PowerSourceOption,
  StreamQuality,
  WasteDisposalOption
} from '../types/estimate';

export interface PlannerValues {
  format: EventFormat;
  attendance: string;
  onlineAttendance: string;
  durationHours: string;
  days: string;
  powerSource: PowerSourceOption;
  audienceReach: AudienceReach;
  catering: CateringOption;
  wasteDisposal: WasteDisposalOption;
  streamQuality: StreamQuality;
  // Measured actuals — only collected when recording a past event. Empty = unknown.
  energyKwh: string;
  wasteKg: string;
  mealsServed: string;
}

export function getInitialPlannerValues(): PlannerValues {
  return {
    format: 'in_person',
    attendance: '0',
    onlineAttendance: '0',
    durationHours: '8',
    days: '1',
    powerSource: 'generator',
    audienceReach: 'regional',
    catering: 'meat_heavy',
    wasteDisposal: 'landfill',
    streamQuality: 'hd',
    energyKwh: '',
    wasteKg: '',
    mealsServed: ''
  };
}

export function isPhysicalFormat(format: EventFormat): boolean {
  return format !== 'virtual';
}

export function hasOnlineFormat(format: EventFormat): boolean {
  return format !== 'in_person';
}

function toNonNegativeInt(value: string): number {
  const parsed = Math.round(Number(value));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function toPositiveDuration(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function toPositiveDays(value: string): number {
  const parsed = Math.round(Number(value));
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

/** Parse an optional measured field: blank/invalid → undefined (use the estimate). */
function toOptionalNonNegative(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function toOptionalNonNegativeInt(value: string): number | undefined {
  const parsed = toOptionalNonNegative(value);
  return parsed === undefined ? undefined : Math.round(parsed);
}

export function toEstimateInput(values: PlannerValues): EstimateInput {
  const physical = isPhysicalFormat(values.format);
  const online = hasOnlineFormat(values.format);

  return {
    format: values.format,
    attendance: values.format === 'virtual' ? 0 : toNonNegativeInt(values.attendance),
    online_attendance: online ? toNonNegativeInt(values.onlineAttendance) : undefined,
    duration_hours: toPositiveDuration(values.durationHours),
    days: toPositiveDays(values.days),
    power_source: physical ? values.powerSource : undefined,
    audience_reach: physical ? values.audienceReach : undefined,
    catering: physical ? values.catering : undefined,
    waste_disposal: physical ? values.wasteDisposal : undefined,
    stream_quality: online ? values.streamQuality : undefined,
    energy_kwh: physical ? toOptionalNonNegative(values.energyKwh) : undefined,
    waste_kg: physical ? toOptionalNonNegative(values.wasteKg) : undefined,
    meals_served: physical ? toOptionalNonNegativeInt(values.mealsServed) : undefined
  };
}

export function countPeople(input: EstimateInput): number {
  return (input.attendance ?? 0) + (input.online_attendance ?? 0);
}

export interface BreakdownCategory {
  key: keyof EstimateBreakdown;
  label: string;
  color: string;
}

export const BREAKDOWN_CATEGORIES: BreakdownCategory[] = [
  { key: 'travel', label: 'Travel', color: '#A855F7' },
  { key: 'accommodation', label: 'Accommodation', color: '#14B8A6' },
  { key: 'catering', label: 'Catering', color: '#EF4444' },
  { key: 'energy', label: 'Energy', color: '#F59E0B' },
  { key: 'waste', label: 'Waste', color: '#22C55E' },
  { key: 'streaming', label: 'Streaming', color: '#3B82F6' }
];

export interface BreakdownSegment extends BreakdownCategory {
  value: number;
  pct: number;
}

export function getBreakdownSegments(result: EstimateResult): BreakdownSegment[] {
  if (result.total <= 0) {
    return [];
  }

  return BREAKDOWN_CATEGORIES.map((category) => {
    const value = result.breakdown[category.key];
    return {
      ...category,
      value,
      pct: (value / result.total) * 100
    };
  }).filter((segment) => segment.value > 0);
}

export type FootprintLevel = 'good' | 'moderate' | 'high';

export interface FootprintGrade {
  level: FootprintLevel;
  label: string;
  color: string;
}

// Per-attendee kg CO2e thresholds — indicative and tunable. Benchmarked to
// event-sector averages: a lean local event sits near 5-10 kg/head, while
// travel-heavy national/international events climb well past 25 kg/head.
const GRADE_LOW_MAX = 10;
const GRADE_MODERATE_MAX = 25;

export function gradeFootprint(perAttendee: number): FootprintGrade {
  if (perAttendee <= GRADE_LOW_MAX) {
    return { level: 'good', label: 'Low', color: '#34D399' };
  }
  if (perAttendee <= GRADE_MODERATE_MAX) {
    return { level: 'moderate', label: 'Moderate', color: '#FBBF24' };
  }
  return { level: 'high', label: 'High', color: '#F87171' };
}
