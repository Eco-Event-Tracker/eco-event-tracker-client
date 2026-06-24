import { PlannerFields } from '../components/planner/PlannerFields';
import { PlannerFootprintPanel } from '../components/planner/PlannerFootprintPanel';
import { PlannerInsights } from '../components/planner/PlannerInsights';
import { usePageTitle } from '../hooks/usePageTitle';
import { usePlanner } from '../hooks/usePlanner';

export function PlannerPage() {
  usePageTitle('Carbon Planner');

  const { values, setField, isPhysical, hasOnline, totalPeople, result, isLoading, error } = usePlanner();

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(20,83,45,0.38),rgba(24,24,27,0.94)_48%,rgba(8,47,73,0.36))] px-5 py-5 shadow-lg shadow-black/20 sm:px-7 sm:py-6">
        <h1 className="font-hero max-w-3xl text-4xl font-semibold leading-none text-zinc-50 sm:text-5xl">
          Plan events that leave a <span className="text-emerald-300">lighter footprint</span>.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-300">
          See carbon estimates change as you choose power, travel, catering, and format. Make smarter
          decisions early, so every event can help move the world a little greener.
        </p>
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-emerald-200/70">
          DEFRA 2024, IEA, and peer reviewed emissions science
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
              Carbon Planner
            </span>
            <p className="font-display text-2xl font-semibold text-emerald-50 sm:text-3xl">
              Plan your event&rsquo;s footprint
            </p>
            <p className="max-w-md text-base text-emerald-200/70">
              Add your event details below and the estimate appears here instantly &mdash; before
              anything is booked.
            </p>
            <button
              type="button"
              onClick={() => {
                const target = values.format === 'virtual' ? 'onlineAttendance' : 'attendance';
                const field = document.getElementById(target);
                field?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                field?.focus({ preventScroll: true });
              }}
              className="mt-1 inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-300"
            >
              Start planning
              <span aria-hidden="true">→</span>
            </button>
          </div>
        }
      />

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
    </div>
  );
}
