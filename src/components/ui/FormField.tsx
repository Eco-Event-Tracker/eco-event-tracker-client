import type { PropsWithChildren } from 'react';

interface FormFieldProps extends PropsWithChildren {
  label: string;
  htmlFor: string;
  error?: string;
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <label htmlFor={htmlFor} className="block space-y-2">
      <span className="text-base font-medium text-zinc-200">{label}</span>
      {children}
      {error ? <span className="block text-xs text-red-300">{error}</span> : null}
    </label>
  );
}
