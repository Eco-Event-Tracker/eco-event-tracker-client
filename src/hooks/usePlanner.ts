import { useContext, useMemo } from 'react';
import { PlannerContext } from '../context/plannerContext';
import type { EstimateResult } from '../types/estimate';
import {
  countPeople,
  hasOnlineFormat,
  isPhysicalFormat,
  toEstimateInput,
  type PlannerValues
} from '../utils/planner';

interface UsePlannerResult {
  values: PlannerValues;
  setField: <K extends keyof PlannerValues>(field: K, value: PlannerValues[K]) => void;
  isPhysical: boolean;
  hasOnline: boolean;
  totalPeople: number;
  result: EstimateResult | null;
  isLoading: boolean;
  error: string;
}

export function usePlanner(): UsePlannerResult {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within PlannerProvider');
  }

  const { values, setField, result, isLoading, error } = context;
  const totalPeople = useMemo(() => countPeople(toEstimateInput(values)), [values]);

  return {
    values,
    setField,
    isPhysical: isPhysicalFormat(values.format),
    hasOnline: hasOnlineFormat(values.format),
    totalPeople,
    result,
    isLoading,
    error
  };
}
