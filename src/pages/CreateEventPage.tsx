import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../components/ui/FormField';
import { PageSection } from '../components/ui/PageSection';
import { useCreateEventForm } from '../hooks/useCreateEventForm';
import { usePageTitle } from '../hooks/usePageTitle';
import { upsertRecentEvent } from '../utils/recentEvents';

const inputClassName =
  'w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-500';

export function CreateEventPage() {
  const navigate = useNavigate();
  const { values, errors, isSubmitting, submitError, setField, submit } = useCreateEventForm();

  usePageTitle('Create Event');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const created = await submit();

    if (created) {
      upsertRecentEvent({
        id: created.id,
        title: created.title,
        location: created.location,
        event_date: created.event_date,
        total_co2: created.emission_data.total_co2
      });
      navigate(`/events/${created.id}`);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <header>
        <h1 className="text-2xl font-semibold text-zinc-100">Create Event</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Add event metadata and emission inputs, then generate the breakdown report.
        </p>
      </header>

      <PageSection title="Event Metadata" description="Title, location, date, attendance and virtual event status.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title" error={errors.title}>
            <input
              id="title"
              className={inputClassName}
              placeholder="Annual Climate Summit"
              value={values.title}
              onChange={(event) => setField('title', event.target.value)}
            />
          </FormField>

          <FormField label="Location" htmlFor="location" error={errors.location}>
            <input
              id="location"
              className={inputClassName}
              placeholder="Lagos Convention Center"
              value={values.location}
              onChange={(event) => setField('location', event.target.value)}
            />
          </FormField>

          <FormField label="Event Date" htmlFor="eventDate" error={errors.eventDate}>
            <input
              id="eventDate"
              type="date"
              className={inputClassName}
              value={values.eventDate}
              onChange={(event) => setField('eventDate', event.target.value)}
            />
          </FormField>

          <FormField label="Attendance Count" htmlFor="participantCount" error={errors.participantCount}>
            <input
              id="participantCount"
              type="number"
              min={0}
              step={1}
              className={inputClassName}
              value={values.participantCount}
              onChange={(event) => setField('participantCount', event.target.value)}
            />
          </FormField>
        </div>

        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-900"
            checked={values.isVirtual}
            onChange={(event) => setField('isVirtual', event.target.checked)}
          />
          <span>Virtual event</span>
        </label>
      </PageSection>

      <PageSection
        title="Emission Data"
        description="Energy usage, travel data, catering meal count, and waste amount."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Energy Usage (kWh)" htmlFor="energyKwh" error={errors.energyKwh}>
            <input
              id="energyKwh"
              type="number"
              min={0}
              step={0.01}
              className={inputClassName}
              value={values.energyKwh}
              onChange={(event) => setField('energyKwh', event.target.value)}
            />
          </FormField>

          <FormField label="Travel Data (km)" htmlFor="travelKm" error={errors.travelKm}>
            <input
              id="travelKm"
              type="number"
              min={0}
              step={0.01}
              className={inputClassName}
              value={values.travelKm}
              onChange={(event) => setField('travelKm', event.target.value)}
            />
          </FormField>

          <FormField label="Catering Meals" htmlFor="cateringMeals" error={errors.cateringMeals}>
            <input
              id="cateringMeals"
              type="number"
              min={0}
              step={1}
              className={inputClassName}
              value={values.cateringMeals}
              onChange={(event) => setField('cateringMeals', event.target.value)}
            />
          </FormField>

          <FormField label="Waste (kg)" htmlFor="wasteKg" error={errors.wasteKg}>
            <input
              id="wasteKg"
              type="number"
              min={0}
              step={0.01}
              className={inputClassName}
              value={values.wasteKg}
              onChange={(event) => setField('wasteKg', event.target.value)}
            />
          </FormField>
        </div>
      </PageSection>

      {submitError ? (
        <div className="rounded-2xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-200">{submitError}</div>
      ) : null}

      <button
        type="submit"
        className="rounded-2xl border border-zinc-700 bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Generating...' : 'Generate emission breakdown reports'}
      </button>
    </form>
  );
}
