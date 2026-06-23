import { FormField } from '../components/ui/FormField';
import { PageSection } from '../components/ui/PageSection';
import { Segmented } from '../components/ui/Segmented';
import { usePageTitle } from '../hooks/usePageTitle';
import { usePlanner } from '../hooks/usePlanner';
import { formatCo2 } from '../utils/format';
import { BREAKDOWN_CATEGORIES } from '../utils/planner';
import type {
  AudienceReach,
  CateringOption,
  EventFormat,
  PowerSourceOption,
  StreamQuality,
  WasteDisposalOption
} from '../types/estimate';

const inputClassName =
  'w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-500';

export function PlannerPage() {
  usePageTitle('Carbon Planner');

  const { values, setField, isPhysical, hasOnline, totalPeople, result, isLoading, error } = usePlanner();
  const total = result?.total ?? 0;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 sm:p-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          Carbon Planner
        </span>
        <h1 className="mt-4 text-2xl font-semibold leading-tight text-zinc-100 sm:text-3xl">
          See your event’s carbon footprint — <span className="text-emerald-400">before</span> it happens.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
          Most carbon tools tell you the damage afterward, when nothing can change. This one shows you
          while the choices are still on the table. Describe your event, flip the levers — power,
          travel, catering, format — and watch the footprint move in real time.
        </p>
        <p className="mt-4 text-xs text-zinc-500">
          Every estimate is grounded in DEFRA 2024, IEA, and peer-reviewed emission science.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-6">
          <PageSection title="Your event" description="What you already know at planning time.">
            <div className="space-y-4">
              <FormField label="Format" htmlFor="format">
                <Segmented
                  options={[
                    { value: 'in_person', label: 'In person' },
                    { value: 'hybrid', label: 'Hybrid' },
                    { value: 'virtual', label: 'Virtual' }
                  ]}
                  value={values.format}
                  onChange={(value) => setField('format', value as EventFormat)}
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                {isPhysical ? (
                  <FormField label="In-room attendance" htmlFor="attendance">
                    <input
                      id="attendance"
                      type="number"
                      min={0}
                      step={1}
                      className={inputClassName}
                      value={values.attendance}
                      onChange={(event) => setField('attendance', event.target.value)}
                    />
                  </FormField>
                ) : null}

                {hasOnline ? (
                  <FormField label="Online participants" htmlFor="onlineAttendance">
                    <input
                      id="onlineAttendance"
                      type="number"
                      min={0}
                      step={1}
                      className={inputClassName}
                      value={values.onlineAttendance}
                      onChange={(event) => setField('onlineAttendance', event.target.value)}
                    />
                  </FormField>
                ) : null}

                <FormField label="Duration (hours)" htmlFor="durationHours">
                  <input
                    id="durationHours"
                    type="number"
                    min={0.5}
                    step={0.5}
                    className={inputClassName}
                    value={values.durationHours}
                    onChange={(event) => setField('durationHours', event.target.value)}
                  />
                </FormField>
              </div>
            </div>
          </PageSection>

          <PageSection title="The levers" description="Flip these to see what cuts the most.">
            <div className="space-y-4">
              {isPhysical ? (
                <>
                  <FormField label="Venue power" htmlFor="powerSource">
                    <Segmented
                      options={[
                        { value: 'grid', label: 'Grid' },
                        { value: 'generator', label: 'Generator' },
                        { value: 'solar', label: 'Solar' },
                        { value: 'mixed', label: 'Grid + gen' }
                      ]}
                      value={values.powerSource}
                      onChange={(value) => setField('powerSource', value as PowerSourceOption)}
                    />
                  </FormField>

                  <FormField label="Where attendees travel from" htmlFor="audienceReach">
                    <Segmented
                      options={[
                        { value: 'local', label: 'Local' },
                        { value: 'regional', label: 'Regional' },
                        { value: 'national', label: 'National' },
                        { value: 'international', label: 'International' }
                      ]}
                      value={values.audienceReach}
                      onChange={(value) => setField('audienceReach', value as AudienceReach)}
                    />
                  </FormField>

                  <FormField label="Catering" htmlFor="catering">
                    <Segmented
                      options={[
                        { value: 'none', label: 'None' },
                        { value: 'plant_forward', label: 'Plant-forward' },
                        { value: 'mixed', label: 'Mixed' },
                        { value: 'meat_heavy', label: 'Meat-heavy' }
                      ]}
                      value={values.catering}
                      onChange={(value) => setField('catering', value as CateringOption)}
                    />
                  </FormField>

                  <FormField label="Waste handling" htmlFor="wasteDisposal">
                    <Segmented
                      options={[
                        { value: 'landfill', label: 'Landfill' },
                        { value: 'recycling', label: 'Recycling' },
                        { value: 'composting', label: 'Composting' }
                      ]}
                      value={values.wasteDisposal}
                      onChange={(value) => setField('wasteDisposal', value as WasteDisposalOption)}
                    />
                  </FormField>
                </>
              ) : null}

              {hasOnline ? (
                <FormField label="Streaming quality" htmlFor="streamQuality">
                  <Segmented
                    options={[
                      { value: 'sd', label: 'SD' },
                      { value: 'hd', label: 'HD' }
                    ]}
                    value={values.streamQuality}
                    onChange={(value) => setField('streamQuality', value as StreamQuality)}
                  />
                </FormField>
              ) : null}
            </div>
          </PageSection>
        </div>

        {/* Live result */}
        <div className="space-y-6 self-start lg:sticky lg:top-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                Estimated footprint
              </span>
              <span className={`text-xs ${isLoading ? 'text-amber-300' : 'text-emerald-400'}`}>
                {isLoading ? 'updating…' : 'live'}
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-semibold text-zinc-100">{formatCo2(total)}</span>
              <span className="text-lg text-zinc-400">kg CO₂e</span>
            </div>
            <div className="mt-1 text-sm text-zinc-400">
              {total >= 1000 ? `${formatCo2(total / 1000)} tonnes · ` : ''}
              {result ? `${formatCo2(result.perAttendee)} kg / attendee` : ''}
              {totalPeople > 0 ? ` · ${formatCo2(totalPeople)} people` : ''}
            </div>

            {result && result.total > 0 ? (
              <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200">
                <span className="font-medium capitalize">{result.biggestContributor.category}</span> is your
                biggest lever — {result.biggestContributor.pct}% of the footprint.
              </div>
            ) : null}

            {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
          </div>

          {result ? (
            <PageSection title="Breakdown" description="Where the carbon comes from.">
              <div className="space-y-3">
                {BREAKDOWN_CATEGORIES.map(({ key, label, color }) => {
                  const value = result.breakdown[key];
                  if (value <= 0) return null;
                  const pct = result.total > 0 ? (value / result.total) * 100 : 0;
                  return (
                    <div key={key}>
                      <div className="mb-1 flex justify-between text-xs text-zinc-300">
                        <span>{label}</span>
                        <span>
                          {formatCo2(value)} kg · {formatCo2(pct)}%
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </PageSection>
          ) : null}

          {result && result.topActions.length > 0 ? (
            <PageSection title="Biggest wins" description="The changes that cut the most — act on these first.">
              <ul className="space-y-2">
                {result.topActions.map((action) => (
                  <li
                    key={action.action}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                  >
                    <span className="text-sm text-zinc-200">{action.action}</span>
                    <span className="whitespace-nowrap rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                      −{formatCo2(action.savingKg)} kg ({action.savingPct}%)
                    </span>
                  </li>
                ))}
              </ul>
            </PageSection>
          ) : null}

          {result ? (
            <details className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-400">
              <summary className="cursor-pointer font-medium text-zinc-300">Assumptions &amp; sources</summary>
              <ul className="mt-3 space-y-2">
                {result.assumptions.map((line) => (
                  <li key={line} className="leading-relaxed">
                    {line}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      </div>
    </div>
  );
}
