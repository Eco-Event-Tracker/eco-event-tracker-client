import { useContext, useState } from 'react';
import { createEvent } from '../api/events';
import { PlannerContext } from '../context/plannerContext';
import type { CreateEventResponse } from '../types/events';
import { useAuth } from './useAuth';
import { usePlanner } from './usePlanner';
import {
  canSaveEvent,
  hasEventMetadataErrors,
  toCreateEventPayload,
  validateEventMetadata,
  type EventMetadataErrors,
  type EventMetadataValues
} from '../utils/createEventForm';
import { toEstimateInput } from '../utils/planner';

interface UseSaveEventFormResult {
  metadata: EventMetadataValues;
  metadataErrors: EventMetadataErrors;
  planner: ReturnType<typeof usePlanner>;
  isSubmitting: boolean;
  submitError: string;
  setMetadataField: <K extends keyof EventMetadataValues>(field: K, value: EventMetadataValues[K]) => void;
  submit: () => Promise<CreateEventResponse | null>;
}

export function useSaveEventForm(): UseSaveEventFormResult {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('useSaveEventForm must be used within PlannerProvider');
  }

  const { session } = useAuth();
  const planner = usePlanner();
  const { metadata, setMetadataField: setSharedMetadataField, resetForm } = context;

  const [metadataErrors, setMetadataErrors] = useState<EventMetadataErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const setMetadataField = <K extends keyof EventMetadataValues>(field: K, value: EventMetadataValues[K]) => {
    setSharedMetadataField(field, value);
    setMetadataErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError('');
  };

  const submit = async (): Promise<CreateEventResponse | null> => {
    const validationErrors = validateEventMetadata(metadata);
    setMetadataErrors(validationErrors);

    if (hasEventMetadataErrors(validationErrors)) {
      return null;
    }

    const plan = toEstimateInput(planner.values);
    if (!canSaveEvent(plan)) {
      setSubmitError('Add attendance before saving.');
      return null;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const userId = session?.user.id;
      if (!userId) {
        throw new Error('Please login to save an event.');
      }

      const created = await createEvent(toCreateEventPayload(metadata, planner.values), userId);
      resetForm();
      return created;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save event.';
      setSubmitError(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    metadata,
    metadataErrors,
    planner,
    isSubmitting,
    submitError,
    setMetadataField,
    submit
  };
}
