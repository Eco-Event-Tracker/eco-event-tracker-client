import { createContext } from 'react';
import type { EstimateResult } from '../types/estimate';
import type { PlannerValues } from '../utils/planner';
import type { EventMetadataValues } from '../utils/createEventForm';

export interface PlannerContextValue {
  /** Shared planning levers — persist across Planner ↔ Record Event navigation. */
  values: PlannerValues;
  setField: <K extends keyof PlannerValues>(field: K, value: PlannerValues[K]) => void;
  /** Record-event metadata (title/location/date + optional description/category). */
  metadata: EventMetadataValues;
  setMetadataField: <K extends keyof EventMetadataValues>(field: K, value: EventMetadataValues[K]) => void;
  /** Live estimate derived from `values`. */
  result: EstimateResult | null;
  isLoading: boolean;
  error: string;
  /** Reset every field back to defaults (e.g. after a successful save). */
  resetForm: () => void;
}

export const PlannerContext = createContext<PlannerContextValue | null>(null);
