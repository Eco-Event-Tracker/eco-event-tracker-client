import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlannerFields } from '../components/planner/PlannerFields';
import { PlannerFootprintPanel } from '../components/planner/PlannerFootprintPanel';
import { PlannerInsights } from '../components/planner/PlannerInsights';
import { FormField } from '../components/ui/FormField';
import { PageSection } from '../components/ui/PageSection';
import { usePageTitle } from '../hooks/usePageTitle';
import { upsertRecentEvent } from '../utils/recentEvents';
import { plannerInputClassName } from '../components/planner/constants';
import { useSaveEventForm } from '../hooks/useSaveEventForm';

export function CreateEventPage() {
  const navigate = useNavigate();
  const {
    metadata,
    metadataErrors,
    planner,
    isSubmitting,
    submitError,
    setMetadataField,
    submit
  } = useSaveEventForm();

  usePageTitle('Record Event');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const created = await submit();

    if (created) {
      upsertRecentEvent({
        id: created.id,
        title: created.title,
        location: created.location,
        event_date: created.event_date,
        total_co2: created.estimated_co2
      });
      navigate(`/events/${created.id}`);
    }
  };

  const { values, setField, isPhysical, hasOnline, totalPeople, result, isLoading, error } = planner;

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(20,83,45,0.38),rgba(24,24,27,0.94)_48%,rgba(8,47,73,0.36))] px-5 py-5 shadow-lg shadow-black/20 sm:px-7 sm:py-6">
        <h1 className="font-hero max-w-3xl text-4xl font-semibold leading-none text-zinc-50 sm:text-5xl">
          Record an event&rsquo;s <span className="text-emerald-300">footprint</span>.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-300">
          Answer the same realistic questions as the planner. We estimate the breakdown from your inputs
          and save the event to your dashboard.
        </p>
      </section>

      <PlannerFootprintPanel
        result={result}
        totalPeople={totalPeople}
        isLoading={isLoading}
        error={error}
        emptyState={
          <div className="flex flex-col items-start gap-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
              Event footprint
            </span>
            <p className="font-display text-2xl font-semibold text-emerald-50 sm:text-3xl">
              Add event details below
            </p>
            <p className="max-w-md text-base text-emerald-200/70">
              Fill in attendance and levers and the estimate appears here before you save.
            </p>
          </div>
        }
      />

      <PageSection title="Event details" description="What happened — title, place, and date.">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title" error={metadataErrors.title}>
            <input
              id="title"
              className={plannerInputClassName}
              placeholder="Annual Climate Summit"
              value={metadata.title}
              onChange={(event) => setMetadataField('title', event.target.value)}
            />
          </FormField>

          <FormField label="Location" htmlFor="location" error={metadataErrors.location}>
            <input
              id="location"
              className={plannerInputClassName}
              placeholder="Lagos Convention Center"
              value={metadata.location}
              onChange={(event) => setMetadataField('location', event.target.value)}
            />
          </FormField>

          <FormField label="Event date" htmlFor="eventDate" error={metadataErrors.eventDate}>
            <input
              id="eventDate"
              type="date"
              className={plannerInputClassName}
              value={metadata.eventDate}
              onChange={(event) => setMetadataField('eventDate', event.target.value)}
            />
          </FormField>
        </div>
      </PageSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <PlannerFields
            values={values}
            isPhysical={isPhysical}
            hasOnline={hasOnline}
            setField={setField}
          />
        </div>

        <div className="space-y-6">
          <PlannerInsights result={result} />
        </div>
      </div>

      {submitError ? (
        <div className="rounded-2xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          {submitError}
        </div>
      ) : null}

      <button
        type="submit"
        className="rounded-2xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
        disabled={isSubmitting || !result || result.total <= 0}
      >
        {isSubmitting ? 'Saving...' : 'Save event'}
      </button>
    </form>
  );
}
