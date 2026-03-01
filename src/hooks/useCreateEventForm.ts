import { useMemo, useState } from 'react';
import { createEvent } from '../api/events';
import type { CreateEventResponse } from '../types/events';
import { useAuth } from './useAuth';
import {
  getInitialCreateEventFormValues,
  hasCreateEventErrors,
  toCreateEventPayload,
  validateCreateEventForm,
  type CreateEventFormErrors,
  type CreateEventFormValues
} from '../utils/createEventForm';

interface UseCreateEventFormResult {
  values: CreateEventFormValues;
  errors: CreateEventFormErrors;
  isSubmitting: boolean;
  submitError: string;
  setField: <K extends keyof CreateEventFormValues>(field: K, value: CreateEventFormValues[K]) => void;
  submit: () => Promise<CreateEventResponse | null>;
}

export function useCreateEventForm(): UseCreateEventFormResult {
  const initialValues = useMemo(() => getInitialCreateEventFormValues(), []);
  const { session } = useAuth();

  const [values, setValues] = useState<CreateEventFormValues>(initialValues);
  const [errors, setErrors] = useState<CreateEventFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const setField = <K extends keyof CreateEventFormValues>(field: K, value: CreateEventFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError('');
  };

  const submit = async (): Promise<CreateEventResponse | null> => {
    const validationErrors = validateCreateEventForm(values);
    setErrors(validationErrors);

    if (hasCreateEventErrors(validationErrors)) {
      return null;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const userId = session?.user.id;
      if (!userId) {
        throw new Error('Please login to create an event.');
      }

      return await createEvent(toCreateEventPayload(values), userId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create event.';
      setSubmitError(message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    submitError,
    setField,
    submit
  };
}
