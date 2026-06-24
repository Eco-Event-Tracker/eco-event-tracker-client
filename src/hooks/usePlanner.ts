import { useEffect, useMemo, useState } from 'react';
import { estimateEvent } from '../api/estimate';
import type { EstimateResult } from '../types/estimate';
import {
  countPeople,
  getInitialPlannerValues,
  hasOnlineFormat,
  isPhysicalFormat,
  toEstimateInput,
  type PlannerValues
} from '../utils/planner';

const ESTIMATE_DEBOUNCE_MS = 250;

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
  const [values, setValues] = useState<PlannerValues>(getInitialPlannerValues);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const input = useMemo(() => toEstimateInput(values), [values]);

  const setField = <K extends keyof PlannerValues>(field: K, value: PlannerValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    let cancelled = false;

    const handle = setTimeout(() => {
      if (countPeople(input) <= 0) {
        if (!cancelled) {
          setResult(null);
          setError('');
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      estimateEvent(input)
        .then((estimate) => {
          if (!cancelled) {
            setResult(estimate);
            setError('');
          }
        })
        .catch((fetchError) => {
          if (!cancelled) {
            setError(fetchError instanceof Error ? fetchError.message : 'Failed to estimate footprint.');
          }
        })
        .finally(() => {
          if (!cancelled) {
            setIsLoading(false);
          }
        });
    }, ESTIMATE_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [input]);

  return {
    values,
    setField,
    isPhysical: isPhysicalFormat(values.format),
    hasOnline: hasOnlineFormat(values.format),
    totalPeople: countPeople(input),
    result,
    isLoading,
    error
  };
}
