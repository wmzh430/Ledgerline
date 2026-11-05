import { useMemo, useState } from "react";
import { Topbar } from "../components/layout/Topbar";
import { Card } from "../components/ui/Card";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import { TransactionsTable } from "../components/transactions/TransactionsTable";
import { Pagination } from "../components/ui/Pagination";
import { Drawer } from "../components/ui/Drawer";
import { TransactionDetail } from "../components/transactions/TransactionDetail";
import { useTransactionFilters } from "../hooks/useTransactionFilters";
import { transactions } from "../data/transactions";
import type { Transaction } from "../types";

const PAGE_SIZE = 20;

export default function Transactions() {
  const { filters, setFilter, resetFilters, filtered, sortKey, sortDir, toggleSort } = useTransactionFilters(transactions);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [page, setPage] = useState(1);

  const querySignature = `${JSON.stringify(filters)}:${sortKey}:${sortDir}`;
  const [lastQuerySignature, setLastQuerySignature] = useState(querySignature);
  if (querySignature !== lastQuerySignature) {
    setLastQuerySignature(querySignature);
    setPage(1);
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  return (
    <div>
      <Topbar title="Transactions" subtitle="All activity across your accounts" />

      <div className="space-y-4 px-6 py-6 md:px-10">
        <Card className="p-4">
          <TransactionFilters
            filters={filters}
            setFilter={setFilter}
            onReset={resetFilters}
            resultCount={filtered.length}
            exportRows={filtered}
          />
        </Card>

        <Card className="overflow-hidden py-2">
          <TransactionsTable
            transactions={pageItems}
            onSelect={setSelected}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={toggleSort}
          />
          <Pagination page={page} pageCount={pageCount} total={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </Card>
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Transaction details">
        {selected && <TransactionDetail transaction={selected} />}
      </Drawer>
    </div>
  );
}
