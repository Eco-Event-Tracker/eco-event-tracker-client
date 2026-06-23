import type {
  AudienceReach,
  CateringOption,
  EstimateBreakdown,
  EstimateInput,
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
  powerSource: PowerSourceOption;
  audienceReach: AudienceReach;
  catering: CateringOption;
  wasteDisposal: WasteDisposalOption;
  streamQuality: StreamQuality;
}

export function getInitialPlannerValues(): PlannerValues {
  return {
    format: 'in_person',
    attendance: '330',
    onlineAttendance: '0',
    durationHours: '8',
    powerSource: 'generator',
    audienceReach: 'regional',
    catering: 'meat_heavy',
    wasteDisposal: 'landfill',
    streamQuality: 'hd'
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

export function toEstimateInput(values: PlannerValues): EstimateInput {
  const physical = isPhysicalFormat(values.format);
  const online = hasOnlineFormat(values.format);

  return {
    format: values.format,
    attendance: values.format === 'virtual' ? 0 : toNonNegativeInt(values.attendance),
    online_attendance: online ? toNonNegativeInt(values.onlineAttendance) : undefined,
    duration_hours: toPositiveDuration(values.durationHours),
    power_source: physical ? values.powerSource : undefined,
    audience_reach: physical ? values.audienceReach : undefined,
    catering: physical ? values.catering : undefined,
    waste_disposal: physical ? values.wasteDisposal : undefined,
    stream_quality: online ? values.streamQuality : undefined
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
  { key: 'catering', label: 'Catering', color: '#EF4444' },
  { key: 'energy', label: 'Energy', color: '#F59E0B' },
  { key: 'waste', label: 'Waste', color: '#22C55E' },
  { key: 'streaming', label: 'Streaming', color: '#3B82F6' }
];
