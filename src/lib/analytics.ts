import type { Transaction, TransactionCategory } from "../types";
import { categoryLabels } from "../data/transactions";

function signedAmount(tx: Transaction) {
  return tx.direction === "credit" ? tx.amount : -tx.amount;
}

function startOfDay(iso: string) {
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export interface CashFlowPoint {
  date: string;
  net: number;
}

export function getCashFlowSeries(transactions: Transaction[], days: number): CashFlowPoint[] {
  const posted = transactions.filter((t) => t.status !== "failed");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const start = new Date(now);
  start.setDate(start.getDate() - (days - 1));
  const startMs = start.getTime();

  const byDay = new Map<number, number>();
  for (const tx of posted) {
    const day = startOfDay(tx.date);
    if (day < startMs) continue;
    byDay.set(day, (byDay.get(day) ?? 0) + signedAmount(tx));
  }

  const points: CashFlowPoint[] = [];
  let running = 0;
  const cursor = new Date(start);
  while (cursor.getTime() <= now.getTime()) {
    const day = cursor.getTime();
    running += byDay.get(day) ?? 0;
    points.push({
      date: cursor.toISOString(),
      net: Math.round(running * 100) / 100,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return points;
}

export interface MonthlyFlow {
  month: string;
  income: number;
  expenses: number;
}

export function getMonthlyIncomeExpense(transactions: Transaction[], months: number): MonthlyFlow[] {
  const posted = transactions.filter((t) => t.status !== "failed");
  const now = new Date();
  const buckets = new Map<string, MonthlyFlow>();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString("en-US", { month: "short" });
    buckets.set(key, { month: key, income: 0, expenses: 0 });
  }

  for (const tx of posted) {
    const d = new Date(tx.date);
    const key = d.toLocaleDateString("en-US", { month: "short" });
    const bucket = buckets.get(key);
    if (!bucket) continue;
    if (tx.direction === "credit") bucket.income += tx.amount;
    else bucket.expenses += tx.amount;
  }

  return Array.from(buckets.values());
}

export interface CategorySlice {
  category: TransactionCategory | "other";
  label: string;
  value: number;
}

export function getCategoryBreakdown(transactions: Transaction[], days: number): CategorySlice[] {
  const now = Date.now();
  const start = now - days * 86_400_000;
  const totals = new Map<TransactionCategory, number>();

  for (const tx of transactions) {
    if (tx.direction !== "debit" || tx.status === "failed") continue;
    if (new Date(tx.date).getTime() < start) continue;
    if (tx.category === "transfer") continue;
    totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount);
  }

  const sorted = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 6);
  const rest = sorted.slice(6).reduce((sum, [, v]) => sum + v, 0);

  const slices: CategorySlice[] = top.map(([category, value]) => ({
    category,
    label: categoryLabels[category],
    value: Math.round(value),
  }));

  if (rest > 0) slices.push({ category: "other", label: "Other", value: Math.round(rest) });
  return slices;
}
