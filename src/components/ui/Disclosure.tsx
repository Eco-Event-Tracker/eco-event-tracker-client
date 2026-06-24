import { useState, type PropsWithChildren } from 'react';

interface DisclosureProps extends PropsWithChildren {
  title: string;
}

export function Disclosure({ title, children }: DisclosureProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-300"
      >
        <span>{title}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
