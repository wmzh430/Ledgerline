import type { ReactNode } from "react";
import { accounts } from "../../data/accounts";
import { categoryLabels } from "../../data/transactions";
import { formatCurrency, formatDateTime } from "../../lib/format";
import { StatusBadge } from "../ui/Badge";
import { CategoryIcon } from "./CategoryIcon";
import type { Transaction } from "../../types";
import { cn } from "../../lib/utils";

const methodLabels: Record<Transaction["method"], string> = {
  ach: "ACH transfer",
  wire: "Wire transfer",
  card: "Card payment",
  check: "Check",
};

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-black/[0.05] py-3 last:border-0">
      <span className="text-sm text-[var(--text-muted)]">{label}</span>
      <span className="text-sm font-medium text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

export function TransactionDetail({ transaction }: { transaction: Transaction }) {
  const account = accounts.find((a) => a.id === transaction.accountId);
  const signedAmount = transaction.direction === "credit" ? transaction.amount : -transaction.amount;

  return (
    <div>
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-sunken)] text-[var(--text-secondary)]">
          <CategoryIcon category={transaction.category} size={22} />
        </div>
        <div>
          <p className="text-lg font-semibold">{transaction.description}</p>
          <p className="text-sm text-[var(--text-muted)]">{categoryLabels[transaction.category]}</p>
        </div>
        <p
          className={cn(
            "text-3xl font-semibold tabular-nums",
            transaction.direction === "credit" ? "text-[var(--status-good-text)]" : "text-[var(--text-primary)]",
          )}
        >
          {signedAmount < 0 ? "-" : "+"}
          {formatCurrency(Math.abs(signedAmount))}
        </p>
        <StatusBadge status={transaction.status} />
      </div>

      <div className="mt-2">
        <Row label="Date" value={formatDateTime(transaction.date)} />
        <Row label="Account" value={account?.name ?? transaction.accountId} />
        <Row label="Category" value={categoryLabels[transaction.category]} />
        <Row label="Method" value={methodLabels[transaction.method]} />
        <Row label="Transaction ID" value={<span className="font-mono text-xs">{transaction.id}</span>} />
        {transaction.memo && <Row label="Memo" value={transaction.memo} />}
      </div>
    </div>
  );
}
