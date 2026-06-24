export type EventFormat = 'in_person' | 'hybrid' | 'virtual';
export type PowerSourceOption = 'grid' | 'generator' | 'solar' | 'mixed';
export type AudienceReach = 'local' | 'regional' | 'national' | 'international';
export type CateringOption = 'none' | 'plant_forward' | 'mixed' | 'meat_heavy';
export type WasteDisposalOption = 'landfill' | 'recycling' | 'composting';
export type StreamQuality = 'sd' | 'hd';

export interface EstimateInput {
  format: EventFormat;
  attendance: number;
  online_attendance?: number;
  duration_hours: number;
  days?: number;
  power_source?: PowerSourceOption;
  audience_reach?: AudienceReach;
  catering?: CateringOption;
  waste_disposal?: WasteDisposalOption;
  stream_quality?: StreamQuality;
  /** Measured venue electricity for the whole event, in kWh (hindsight actual). */
  energy_kwh?: number;
  /** Measured total waste for the whole event, in kg (hindsight actual). */
  waste_kg?: number;
  /** Actual number of meals served across the whole event (hindsight actual). */
  meals_served?: number;
}

export interface EstimateBreakdown {
  energy: number;
  travel: number;
  catering: number;
  waste: number;
  streaming: number;
  accommodation: number;
}

export interface EstimateAction {
  action: string;
  savingKg: number;
  savingPct: number;
}

export interface EstimateResult {
  total: number;
  breakdown: EstimateBreakdown;
  perAttendee: number;
  biggestContributor: { category: keyof EstimateBreakdown; kg: number; pct: number };
  assumptions: string[];
  topActions: EstimateAction[];
}
