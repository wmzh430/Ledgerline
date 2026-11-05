import { formatCurrency } from "../../lib/format";

interface Payload {
  name: string;
  value: number;
  color: string;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: Payload[];
}

export function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-black/[0.06] bg-white px-3 py-2 shadow-lg">
      {label && <p className="mb-1.5 text-xs font-medium text-[var(--text-muted)]">{label}</p>}
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
            <span className="text-[var(--text-secondary)]">{item.name}</span>
            <span className="ml-auto font-medium tabular-nums text-[var(--text-primary)]">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
