import type { PropsWithChildren, ReactNode } from 'react';

interface PageSectionProps extends PropsWithChildren {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}

export function PageSection({ title, description, action, children }: PageSectionProps) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300">{title}</h2>
          {description ? <p className="mt-1 text-sm text-zinc-400">{description}</p> : null}
        </div>
        {action ?? null}
      </header>
      {children}
    </section>
  );
}
