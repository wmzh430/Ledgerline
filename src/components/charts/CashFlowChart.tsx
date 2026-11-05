import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getCashFlowSeries } from "../../lib/analytics";
import { formatCompactCurrency, formatShortDate } from "../../lib/format";
import { ChartTooltip } from "./ChartTooltip";
import type { Transaction } from "../../types";
import { cn } from "../../lib/utils";

const RANGES = [
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "6M", days: 180 },
] as const;

export function CashFlowChart({ transactions }: { transactions: Transaction[] }) {
  const [days, setDays] = useState<number>(90);
  const data = useMemo(() => getCashFlowSeries(transactions, days), [transactions, days]);
  const tickEvery = Math.ceil(data.length / 6);

  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-1">
        {RANGES.map((r) => (
          <button
            key={r.label}
            onClick={() => setDays(r.days)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              days === r.days
                ? "bg-[var(--surface-sunken)] text-[var(--text-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
            )}
          >
            {r.label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--series-1)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--series-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--gridline)" strokeDasharray="0" />
          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            interval={tickEvery}
            tick={{ fontSize: 12, fill: "var(--text-muted)" }}
            axisLine={{ stroke: "var(--gridline)" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatCompactCurrency(v)}
            tick={{ fontSize: 12, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip
            content={({ active, label, payload }) => (
              <ChartTooltip
                active={active}
                label={label ? formatShortDate(String(label)) : undefined}
                payload={payload?.map((p) => ({
                  name: "Net cash flow",
                  value: Number(p.value),
                  color: "var(--series-1)",
                }))}
              />
            )}
          />
          <Area
            type="monotone"
            dataKey="net"
            stroke="var(--series-1)"
            strokeWidth={2}
            fill="url(#netFill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
