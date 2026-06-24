import type { ReactNode } from 'react';
import type { EstimateResult } from '../../types/estimate';
import { formatCo2 } from '../../utils/format';
import { BREAKDOWN_CATEGORIES, getBreakdownSegments, gradeFootprint } from '../../utils/planner';

interface PlannerFootprintPanelProps {
  result: EstimateResult | null;
  totalPeople: number;
  isLoading?: boolean;
  error?: string;
  showLiveIndicator?: boolean;
  emptyState?: ReactNode;
}

export function PlannerFootprintPanel({
  result,
  totalPeople,
  isLoading = false,
  error = '',
  showLiveIndicator = true,
  emptyState
}: PlannerFootprintPanelProps) {
  const total = result?.total ?? 0;
  const hasResult = Boolean(result && result.total > 0);
  const biggestColor =
    BREAKDOWN_CATEGORIES.find((category) => category.key === result?.biggestContributor.category)?.color ??
    '#34D399';
  const grade = result ? gradeFootprint(result.perAttendee) : null;
  const gradeColor = grade?.color ?? '#34D399';
  const breakdownSegments = result ? getBreakdownSegments(result) : [];

  return (
    <div className="sticky top-4 z-20 rounded-3xl border border-emerald-500/30 bg-emerald-950 p-5 shadow-lg shadow-emerald-950/50 sm:p-6">
      {result ? (
        <>
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
                    title={`${formatCo2(result.perAttendee)} KG/attendee, graded against event-sector averages (≤10 low, ≤25 moderate)`}
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
              {showLiveIndicator ? (
                <span
                  className={`flex items-center gap-1.5 text-xs font-medium ${
                    isLoading ? 'text-amber-300' : 'text-emerald-300'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-amber-300' : 'bg-emerald-400'}`} />
                  {isLoading ? 'updating' : 'live'}
                </span>
              ) : null}

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
                      {result.biggestContributor.category}
                    </span>{' '}
                    is your biggest lever
                  </span>
                  <span className="font-display text-lg font-semibold text-emerald-50">
                    {result.biggestContributor.pct}%
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {hasResult ? (
            <div className="mt-4 rounded-full bg-emerald-950/80 p-1 shadow-inner shadow-black/30 ring-1 ring-inset ring-emerald-200/15">
              <div aria-label="Carbon footprint breakdown" className="flex h-4 gap-1">
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
        </>
      ) : (
        emptyState
      )}

      {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
