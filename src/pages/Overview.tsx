import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { Topbar } from "../components/layout/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { StatTile } from "../components/overview/StatTile";
import { BalanceCard } from "../components/overview/BalanceCard";
import { CashFlowChart } from "../components/charts/CashFlowChart";
import { IncomeExpenseBars } from "../components/charts/IncomeExpenseBars";
import { CategoryDonut } from "../components/charts/CategoryDonut";
import { TransactionsTable } from "../components/transactions/TransactionsTable";
import { Drawer } from "../components/ui/Drawer";
import { TransactionDetail } from "../components/transactions/TransactionDetail";
import { accounts } from "../data/accounts";
import { transactions } from "../data/transactions";
import { formatCurrency } from "../lib/format";
import type { Transaction } from "../types";
import { Link } from "react-router-dom";

export default function Overview() {
  const [selected, setSelected] = useState<Transaction | null>(null);

  const totalCash = accounts.reduce((sum, a) => sum + a.balance, 0);

  const { moneyIn, moneyOut } = useMemo(() => {
    const cutoff = Date.now() - 30 * 86_400_000;
    let inflow = 0;
    let outflow = 0;
    for (const tx of transactions) {
      if (tx.status === "failed" || new Date(tx.date).getTime() < cutoff) continue;
      if (tx.direction === "credit") inflow += tx.amount;
      else outflow += tx.amount;
    }
    return { moneyIn: inflow, moneyOut: outflow };
  }, []);

  const recent = transactions.slice(0, 6);

  return (
    <div>
      <Topbar title="Overview" subtitle="Here's what's happening across your accounts" />

      <div className="space-y-6 px-6 py-6 md:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatTile label="Total cash position" value={formatCurrency(totalCash)} icon={<Wallet size={16} className="text-[var(--text-muted)]" />} />
          <StatTile
            label="Money in (30d)"
            value={formatCurrency(moneyIn)}
            delta={{ value: "+12.4%", direction: "up", isGood: true }}
            icon={<ArrowDownLeft size={16} className="text-[var(--status-good-text)]" />}
          />
          <StatTile
            label="Money out (30d)"
            value={formatCurrency(moneyOut)}
            delta={{ value: "+6.1%", direction: "up", isGood: false }}
            icon={<ArrowUpRight size={16} className="text-[var(--status-critical)]" />}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {accounts.map((account) => (
            <BalanceCard key={account.id} account={account} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cash flow</CardTitle>
          </CardHeader>
          <CardContent>
            <CashFlowChart transactions={transactions} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Income vs. expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeExpenseBars transactions={transactions} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Spend by category (30d)</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryDonut transactions={transactions} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
            <Link to="/transactions" className="text-sm font-medium text-[var(--brand)] hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <TransactionsTable
              transactions={recent}
              onSelect={setSelected}
              sortKey="date"
              sortDir="desc"
              onSort={() => {}}
            />
          </CardContent>
        </Card>
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Transaction details">
        {selected && <TransactionDetail transaction={selected} />}
      </Drawer>
    </div>
  );
}
