import type { PropsWithChildren } from 'react';
import type { EstimateResult } from '../../types/estimate';
import { formatCo2 } from '../../utils/format';
import { Disclosure } from '../ui/Disclosure';
import { PageSection } from '../ui/PageSection';
import { PLANNER_HELP_URL } from './constants';

interface PlannerInsightsProps {
  result: EstimateResult | null;
}

function InsightsPlaceholder({ children }: PropsWithChildren) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-4 py-8 text-center">
      <p className="max-w-xs text-sm text-zinc-500">{children}</p>
    </div>
  );
}

export function PlannerInsights({ result }: PlannerInsightsProps) {
  const hasActions = Boolean(result && result.topActions.length > 0);
  const hasAssumptions = Boolean(result && result.assumptions.length > 0);

  return (
    <>
      <PageSection
        title="Biggest wins"
        description="The changes that cut the most, act on these first."
        action={
          <a
            href={PLANNER_HELP_URL}
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
        {hasActions ? (
          <ul className="space-y-2">
            {result!.topActions.map((action) => (
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
        ) : (
          <InsightsPlaceholder>
            {result
              ? 'No quick wins left — these choices are already low-impact.'
              : 'Add attendance and set the levers to reveal the highest-impact changes.'}
          </InsightsPlaceholder>
        )}
      </PageSection>

      <Disclosure title="Assumptions & sources">
        {hasAssumptions ? (
          <ul className="space-y-2 text-sm text-zinc-400">
            {result!.assumptions.map((line) => (
              <li key={line} className="leading-relaxed">
                {line}
              </li>
            ))}
          </ul>
        ) : (
          <InsightsPlaceholder>
            Assumptions and emission-factor sources appear here once you add attendance.
          </InsightsPlaceholder>
        )}
      </Disclosure>
    </>
  );
}
