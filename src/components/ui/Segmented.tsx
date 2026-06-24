interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}

export function Segmented({ options, value, onChange }: SegmentedProps) {
  return (
    <div className="flex flex-wrap gap-1 rounded-2xl border border-zinc-700 bg-zinc-950 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
            value === option.value ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-300 hover:bg-zinc-800'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
