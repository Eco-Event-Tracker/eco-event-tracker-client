import type { PropsWithChildren, ReactNode } from 'react';

interface PageSectionProps extends PropsWithChildren {
  title: string;
  description?: ReactNode;
}

export function PageSection({ title, description, children }: PageSectionProps) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
        {description ? <p className="mt-1 text-sm text-zinc-400">{description}</p> : null}
      </header>
      {children}
    </section>
  );
}
