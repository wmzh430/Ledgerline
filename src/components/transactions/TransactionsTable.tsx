import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { Transaction } from "../../types";
import { accounts } from "../../data/accounts";
import { categoryLabels } from "../../data/transactions";
import { formatShortDate, formatSigned } from "../../lib/format";
import { StatusBadge } from "../ui/Badge";
import { CategoryIcon } from "./CategoryIcon";
import { cn } from "../../lib/utils";
import type { SortKey } from "../../hooks/useTransactionFilters";

interface TransactionsTableProps {
  transactions: Transaction[];
  onSelect: (tx: Transaction) => void;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSort: (key: SortKey) => void;
}

const accountName = (id: string) => accounts.find((a) => a.id === id)?.name ?? id;

function SortButton({
  label,
  active,
  dir,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn("flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)] hover:text-[var(--text-primary)]", className)}
    >
      {label}
      {active ? dir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} /> : <ArrowUpDown size={12} className="opacity-40" />}
    </button>
  );
}

export function TransactionsTable({ transactions, onSelect, sortKey, sortDir, onSort }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-[var(--text-primary)]">No transactions found</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div className="grid grid-cols-[2.2fr_1fr_1fr_0.9fr_0.9fr_1fr] gap-3 border-b border-black/[0.06] px-5 py-3">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Description</span>
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Account</span>
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Category</span>
          <SortButton label="Date" active={sortKey === "date"} dir={sortDir} onClick={() => onSort("date")} />
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Status</span>
          <SortButton label="Amount" active={sortKey === "amount"} dir={sortDir} onClick={() => onSort("amount")} className="justify-end" />
        </div>

        <div>
          {transactions.map((tx) => (
            <button
              key={tx.id}
              onClick={() => onSelect(tx)}
              className="grid w-full grid-cols-[2.2fr_1fr_1fr_0.9fr_0.9fr_1fr] items-center gap-3 border-b border-black/[0.04] px-5 py-3.5 text-left transition-colors last:border-0 hover:bg-[var(--surface-sunken)]"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-sunken)] text-[var(--text-secondary)]">
                  <CategoryIcon category={tx.category} />
                </span>
                <span className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">{tx.description}</p>
                  <p className="truncate text-xs uppercase tracking-wide text-[var(--text-muted)]">{tx.method}</p>
                </span>
              </span>
              <span className="truncate text-sm text-[var(--text-secondary)]">{accountName(tx.accountId)}</span>
              <span className="truncate text-sm text-[var(--text-secondary)]">{categoryLabels[tx.category]}</span>
              <span className="text-sm text-[var(--text-secondary)]">{formatShortDate(tx.date)}</span>
              <span><StatusBadge status={tx.status} /></span>
              <span
                className={cn(
                  "text-right text-sm font-medium tabular-nums",
                  tx.direction === "credit" ? "text-[var(--status-good-text)]" : "text-[var(--text-primary)]",
                )}
              >
                {formatSigned(tx.direction === "credit" ? tx.amount : -tx.amount)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
