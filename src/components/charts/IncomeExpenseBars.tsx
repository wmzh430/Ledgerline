import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getMonthlyIncomeExpense } from "../../lib/analytics";
import { formatCompactCurrency } from "../../lib/format";
import { ChartTooltip } from "./ChartTooltip";
import type { Transaction } from "../../types";

export function IncomeExpenseBars({ transactions }: { transactions: Transaction[] }) {
  const data = useMemo(() => getMonthlyIncomeExpense(transactions, 6), [transactions]);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={4}>
        <CartesianGrid vertical={false} stroke="var(--gridline)" />
        <XAxis
          dataKey="month"
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
          cursor={{ fill: "var(--surface-sunken)" }}
          content={({ active, label, payload }) => (
            <ChartTooltip
              active={active}
              label={label ? String(label) : undefined}
              payload={payload?.map((p) => ({
                name: p.name === "income" ? "Income" : "Expenses",
                value: Number(p.value),
                color: p.name === "income" ? "var(--series-1)" : "var(--series-2)",
              }))}
            />
          )}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span className="text-sm text-[var(--text-secondary)]">
              {value === "income" ? "Income" : "Expenses"}
            </span>
          )}
        />
        <Bar dataKey="income" fill="var(--series-1)" radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false} />
        <Bar dataKey="expenses" fill="var(--series-2)" radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
