import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getCategoryBreakdown } from "../../lib/analytics";
import { formatCompactCurrency, formatCurrency } from "../../lib/format";
import type { Transaction } from "../../types";

const SLOT_COLORS = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-7)",
  "var(--text-muted)",
];

export function CategoryDonut({ transactions }: { transactions: Transaction[] }) {
  const data = useMemo(() => getCategoryBreakdown(transactions, 30), [transactions]);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="relative h-[180px] w-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={58}
              outerRadius={80}
              paddingAngle={2}
              stroke="var(--surface-1)"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {data.map((entry, i) => (
                <Cell key={entry.category} fill={SLOT_COLORS[i % SLOT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0];
                return (
                  <div className="rounded-lg border border-black/[0.06] bg-white px-3 py-2 shadow-lg">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-sm tabular-nums text-[var(--text-secondary)]">
                      {formatCurrency(Number(p.value))}
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-[var(--text-muted)]">Total spend</span>
          <span className="text-base font-semibold tabular-nums">{formatCompactCurrency(total)}</span>
        </div>
      </div>

      <ul className="flex-1 space-y-2">
        {data.map((entry, i) => (
          <li key={entry.category} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: SLOT_COLORS[i % SLOT_COLORS.length] }}
            />
            <span className="text-[var(--text-secondary)]">{entry.label}</span>
            <span className="ml-auto font-medium tabular-nums">{formatCurrency(entry.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
