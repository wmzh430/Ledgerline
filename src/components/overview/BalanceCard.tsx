import { Landmark, PiggyBank, TrendingUp } from "lucide-react";
import { Card } from "../ui/Card";
import { formatCurrency, maskAccountNumber } from "../../lib/format";
import type { Account } from "../../types";

const typeMeta = {
  checking: { label: "Checking", icon: Landmark },
  savings: { label: "Savings", icon: PiggyBank },
  treasury: { label: "Treasury", icon: TrendingUp },
};

export function BalanceCard({ account }: { account: Account }) {
  const meta = typeMeta[account.type];
  const Icon = meta.icon;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: `color-mix(in srgb, ${account.color} 14%, white)` }}
          >
            <Icon size={16} style={{ color: account.color }} />
          </div>
          <div>
            <p className="text-sm font-medium">{account.name}</p>
            <p className="text-xs text-[var(--text-muted)]">{meta.label}</p>
          </div>
        </div>
        {account.apy && (
          <span className="rounded-full bg-[#e9f7e9] px-2 py-1 text-xs font-medium text-[var(--status-good-text)]">
            {account.apy}% APY
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-semibold tabular-nums">{formatCurrency(account.balance)}</p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{maskAccountNumber(account.accountNumber)}</p>
    </Card>
  );
}
