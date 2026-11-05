import { useMemo, useState } from "react";
import type { Transaction, TransactionCategory, TransactionStatus } from "../types";

export type SortKey = "date" | "amount";

export interface Filters {
  search: string;
  accountId: string | "all";
  category: TransactionCategory | "all";
  status: TransactionStatus | "all";
  range: number | "all";
}

const defaultFilters: Filters = {
  search: "",
  accountId: "all",
  category: "all",
  status: "all",
  range: "all",
};

export function useTransactionFilters(transactions: Transaction[]) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    const cutoff = filters.range === "all" ? null : Date.now() - filters.range * 86_400_000;
    const query = filters.search.trim().toLowerCase();

    const result = transactions.filter((tx) => {
      if (filters.accountId !== "all" && tx.accountId !== filters.accountId) return false;
      if (filters.category !== "all" && tx.category !== filters.category) return false;
      if (filters.status !== "all" && tx.status !== filters.status) return false;
      if (cutoff && new Date(tx.date).getTime() < cutoff) return false;
      if (query) {
        const haystack = `${tx.description} ${tx.category}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "amount") return (a.amount - b.amount) * dir;
      return a.date.localeCompare(b.date) * dir;
    });

    return result;
  }, [transactions, filters, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  return { filters, setFilter, resetFilters: () => setFilters(defaultFilters), filtered, sortKey, sortDir, toggleSort };
}
