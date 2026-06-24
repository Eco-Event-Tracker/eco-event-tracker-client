import { Disclosure } from '../components/ui/Disclosure';
import { FormField } from '../components/ui/FormField';
import { PageSection } from '../components/ui/PageSection';
import { Segmented } from '../components/ui/Segmented';
import { usePageTitle } from '../hooks/usePageTitle';
import { usePlanner } from '../hooks/usePlanner';
import { formatCo2 } from '../utils/format';
import { BREAKDOWN_CATEGORIES, gradeFootprint } from '../utils/planner';
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

const HELP_URL = 'https://en.wikipedia.org/wiki/Sustainable_event_management';

export function PlannerPage() {
  usePageTitle('Carbon Planner');

  const { values, setField, isPhysical, hasOnline, totalPeople, result, isLoading, error } = usePlanner();
  const total = result?.total ?? 0;
  const hasResult = Boolean(result && result.total > 0);
  const biggestColor =
    BREAKDOWN_CATEGORIES.find((category) => category.key === result?.biggestContributor.category)?.color ??
    '#34D399';
  const grade = result ? gradeFootprint(result.perAttendee) : null;
  const gradeColor = grade?.color ?? '#34D399';
  const breakdownSegments =
    result && result.total > 0
      ? BREAKDOWN_CATEGORIES.map((category) => {
          const value = result.breakdown[category.key];
          return {
            ...category,
            value,
            pct: (value / result.total) * 100
          };
        }).filter((segment) => segment.value > 0)
      : [];

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

      {/* Sticky live footprint stays visible while you scroll and edit */}
      <div className="sticky top-4 z-20 rounded-3xl border border-emerald-500/30 bg-emerald-950 p-5 shadow-lg shadow-emerald-950/50 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/80">
              Estimated footprint
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className="font-display text-5xl font-semibold sm:text-6xl"
                style={{
                  backgroundImage: `linear-gradient(135deg, #ffffff 10%, ${gradeColor})`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent'
                }}
              >
                {formatCo2(total)}
              </span>
              <span className="text-base font-bold text-emerald-200/80">KG CO₂e</span>
            </div>
            {grade ? (
              <div className="mt-2">
                <span
                  title={`${formatCo2(result!.perAttendee)} KG/attendee, graded against event-sector averages (≤10 low, ≤25 moderate)`}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ backgroundColor: `${grade.color}26`, color: grade.color }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: grade.color }} />
                  {grade.label}
                </span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end sm:text-right">
            <span
              className={`flex items-center gap-1.5 text-xs font-medium ${
                isLoading ? 'text-amber-300' : 'text-emerald-300'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-amber-300' : 'bg-emerald-400'}`} />
              {isLoading ? 'updating' : 'live'}
            </span>

            <div className="text-sm text-emerald-200/70">
              {total >= 1000 ? `${formatCo2(total / 1000)} tonnes · ` : ''}
              {result ? `${formatCo2(result.perAttendee)} KG / attendee` : ''}
              {totalPeople > 0 ? ` · ${formatCo2(totalPeople)} people` : ''}
            </div>

            {hasResult ? (
              <div className="flex items-baseline gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: biggestColor }} />
                <span className="text-sm text-emerald-100/80">
                  <span className="font-display text-xl font-semibold capitalize leading-none text-emerald-50 sm:text-2xl">
                    {result!.biggestContributor.category}
                  </span>{' '}
                  is your biggest lever
                </span>
                <span className="font-display text-lg font-semibold text-emerald-50">
                  {result!.biggestContributor.pct}%
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {hasResult ? (
          <div className="mt-4 rounded-full bg-emerald-950/80 p-1 shadow-inner shadow-black/30 ring-1 ring-inset ring-emerald-200/15">
            <div
              aria-label="Carbon footprint breakdown"
              className="flex h-4 gap-1"
            >
              {breakdownSegments.map(({ key, label, color, value, pct }) => (
                <div
                  key={key}
                  title={`${label}: ${formatCo2(value)} KG, ${formatCo2(pct)}%`}
                  className="h-full min-w-3 origin-left rounded-full transition-[flex-grow,background-color] duration-700 ease-out motion-safe:animate-[segment-fill_520ms_ease-out]"
                  style={{
                    flexBasis: 0,
                    flexGrow: Math.max(pct, 0.75),
                    backgroundColor: color
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}

        {hasResult ? (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {breakdownSegments.map(({ key, label, color, value, pct }) => (
                <span key={key} className="flex items-center gap-1.5 text-xs text-emerald-100/90">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                  {label}
                  <span className="font-bold text-emerald-50">{formatCo2(value)} KG</span>
                  <span className="text-[0.7rem] text-emerald-200/50">{formatCo2(pct)}%</span>
                </span>
              ))}
          </div>
        ) : null}

        {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
      </div>

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

        {/* Detail */}
        <div className="space-y-6">
          {result && result.topActions.length > 0 ? (
            <PageSection
              title="Biggest wins"
              description="The changes that cut the most, act on these first."
              action={
                <a
                  href={HELP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Learn how to make these changes happen"
                  title="How to make these changes happen"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-zinc-700 bg-zinc-950 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                >
                  ?
                </a>
              }
            >
              <ul className="space-y-2">
                {result.topActions.map((action) => (
                  <li
                    key={action.action}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                  >
                    <span className="text-sm text-zinc-200">{action.action}</span>
                    <span className="whitespace-nowrap rounded-full bg-emerald-500/15 px-2.5 py-1 text-emerald-300">
                      −<span className="text-xs font-bold">{formatCo2(action.savingKg)} KG</span>{' '}
                      <span className="text-[0.7rem] text-emerald-300/60">({action.savingPct}%)</span>
                    </span>
                  </li>
                ))}
              </ul>
            </PageSection>
          ) : null}

          {result ? (
            <Disclosure title="Assumptions & sources">
              <ul className="space-y-2 text-sm text-zinc-400">
                {result.assumptions.map((line) => (
                  <li key={line} className="leading-relaxed">
                    {line}
                  </li>
                ))}
              </ul>
            </Disclosure>
          ) : null}
        </div>
      </div>
    </div>
  );
}
