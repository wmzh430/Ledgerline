export type AccountType = "checking" | "savings" | "treasury";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  accountNumber: string;
  routingNumber: string;
  balance: number;
  apy?: number;
  color: string;
}

export type TransactionStatus = "posted" | "pending" | "failed";
export type TransactionDirection = "credit" | "debit";

export type TransactionCategory =
  | "payroll"
  | "revenue"
  | "software"
  | "contractors"
  | "office"
  | "travel"
  | "marketing"
  | "taxes"
  | "transfer"
  | "fees";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  accountId: string;
  category: TransactionCategory;
  direction: TransactionDirection;
  amount: number;
  status: TransactionStatus;
  method: "ach" | "wire" | "card" | "check";
  memo?: string;
}

export type CardStatus = "active" | "frozen";

export interface VirtualCard {
  id: string;
  label: string;
  holder: string;
  number: string;
  last4: string;
  expiry: string;
  network: "visa" | "mastercard";
  status: CardStatus;
  limit: number;
  spent: number;
  accountId: string;
}
