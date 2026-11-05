import type { Account } from "../types";

export const accounts: Account[] = [
  {
    id: "acc_checking",
    name: "Operating",
    type: "checking",
    accountNumber: "8814062931",
    routingNumber: "026073150",
    balance: 412_384.22,
    color: "var(--series-1)",
  },
  {
    id: "acc_savings",
    name: "Reserve",
    type: "savings",
    accountNumber: "7720184455",
    routingNumber: "026073150",
    balance: 860_000.0,
    apy: 4.35,
    color: "var(--series-3)",
  },
  {
    id: "acc_treasury",
    name: "Treasury",
    type: "treasury",
    accountNumber: "5591273308",
    routingNumber: "026073150",
    balance: 1_250_000.0,
    apy: 5.12,
    color: "var(--series-7)",
  },
];
