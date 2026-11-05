import { Download, Search, X } from "lucide-react";
import { accounts } from "../../data/accounts";
import { categoryLabels } from "../../data/transactions";
import type { Filters } from "../../hooks/useTransactionFilters";
import { Button } from "../ui/Button";
import type { Transaction } from "../../types";

const RANGE_OPTIONS: { label: string; value: Filters["range"] }[] = [
  { label: "All time", value: "all" },
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
];

interface TransactionFiltersProps {
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onReset: () => void;
  resultCount: number;
  exportRows: Transaction[];
}

function toCsv(rows: Transaction[]) {
  const header = ["Date", "Description", "Category", "Status", "Amount"];
  const lines = rows.map((tx) =>
    [
      new Date(tx.date).toISOString(),
      tx.description,
      categoryLabels[tx.category],
      tx.status,
      (tx.direction === "credit" ? tx.amount : -tx.amount).toFixed(2),
    ]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

function downloadCsv(rows: Transaction[]) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function TransactionFilters({ filters, setFilter, onReset, resultCount, exportRows }: TransactionFiltersProps) {
  const hasActiveFilters =
    filters.search || filters.accountId !== "all" || filters.category !== "all" || filters.status !== "all" || filters.range !== "all";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            placeholder="Search transactions"
            className="h-10 w-full rounded-lg border border-black/10 bg-white pl-9 pr-3 text-sm outline-none focus:border-[var(--brand)]"
          />
        </div>

        <select
          value={filters.accountId}
          onChange={(e) => setFilter("accountId", e.target.value)}
          className="h-10 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--brand)]"
        >
          <option value="all">All accounts</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilter("category", e.target.value as Filters["category"])}
          className="h-10 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--brand)]"
        >
          <option value="all">All categories</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilter("status", e.target.value as Filters["status"])}
          className="h-10 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--brand)]"
        >
          <option value="all">All statuses</option>
          <option value="posted">Posted</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={filters.range}
          onChange={(e) => setFilter("range", e.target.value === "all" ? "all" : Number(e.target.value))}
          className="h-10 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[var(--brand)]"
        >
          {RANGE_OPTIONS.map((o) => (
            <option key={o.label} value={o.value}>{o.label}</option>
          ))}
        </select>

        <Button variant="secondary" size="md" onClick={() => downloadCsv(exportRows)}>
          <Download size={15} />
          Export
        </Button>
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
        <span>{resultCount} transaction{resultCount === 1 ? "" : "s"}</span>
        {hasActiveFilters && (
          <button onClick={onReset} className="flex items-center gap-1 font-medium text-[var(--brand)] hover:underline">
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
