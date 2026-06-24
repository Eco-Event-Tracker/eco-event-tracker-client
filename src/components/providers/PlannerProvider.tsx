import { useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { estimateEvent } from '../../api/estimate';
import { PlannerContext } from '../../context/plannerContext';
import type { EstimateResult } from '../../types/estimate';
import { getInitialEventMetadata, type EventMetadataValues } from '../../utils/createEventForm';
import { countPeople, getInitialPlannerValues, toEstimateInput, type PlannerValues } from '../../utils/planner';

const ESTIMATE_DEBOUNCE_MS = 250;

export function PlannerProvider({ children }: PropsWithChildren) {
  const [values, setValues] = useState<PlannerValues>(getInitialPlannerValues);
  const [metadata, setMetadata] = useState<EventMetadataValues>(getInitialEventMetadata);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const input = useMemo(() => toEstimateInput(values), [values]);

  const setField = <K extends keyof PlannerValues>(field: K, value: PlannerValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const setMetadataField = <K extends keyof EventMetadataValues>(field: K, value: EventMetadataValues[K]) => {
    setMetadata((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setValues(getInitialPlannerValues());
    setMetadata(getInitialEventMetadata());
    setResult(null);
    setError('');
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

  const value = useMemo(
    () => ({ values, setField, metadata, setMetadataField, result, isLoading, error, resetForm }),
    [values, metadata, result, isLoading, error]
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}
