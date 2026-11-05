import type { Transaction, TransactionCategory } from "../types";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const range = (min: number, max: number) => min + rand() * (max - min);

interface Template {
  category: TransactionCategory;
  direction: "credit" | "debit";
  counterparties: string[];
  amount: [number, number];
  method: Transaction["method"];
}

const templates: Template[] = [
  {
    category: "revenue",
    direction: "credit",
    counterparties: ["Stripe Payout", "Brex Customer Invoice", "Ramp Partner Settlement"],
    amount: [8_000, 72_000],
    method: "ach",
  },
  {
    category: "payroll",
    direction: "debit",
    counterparties: ["Gusto Payroll", "Rippling Payroll"],
    amount: [38_000, 54_000],
    method: "ach",
  },
  {
    category: "software",
    direction: "debit",
    counterparties: ["AWS", "Vercel", "Figma", "Linear", "Datadog", "Notion", "GitHub"],
    amount: [49, 3_800],
    method: "card",
  },
  {
    category: "contractors",
    direction: "debit",
    counterparties: ["Toptal Contractor", "Upwork Escrow", "Independent Contractor"],
    amount: [1_200, 9_500],
    method: "wire",
  },
  {
    category: "office",
    direction: "debit",
    counterparties: ["WeWork", "Staples", "Amazon Business", "CrateSecure Storage"],
    amount: [85, 4_200],
    method: "card",
  },
  {
    category: "travel",
    direction: "debit",
    counterparties: ["United Airlines", "Delta Air Lines", "Marriott", "Uber"],
    amount: [60, 2_100],
    method: "card",
  },
  {
    category: "marketing",
    direction: "debit",
    counterparties: ["Google Ads", "LinkedIn Ads", "Webflow", "Mailchimp"],
    amount: [200, 7_500],
    method: "card",
  },
  {
    category: "taxes",
    direction: "debit",
    counterparties: ["EFTPS Federal Tax", "State Franchise Tax Board"],
    amount: [3_000, 22_000],
    method: "ach",
  },
  {
    category: "transfer",
    direction: "debit",
    counterparties: ["Transfer to Reserve", "Transfer to Treasury"],
    amount: [10_000, 150_000],
    method: "ach",
  },
  {
    category: "fees",
    direction: "debit",
    counterparties: ["Wire Transfer Fee", "Monthly Account Fee"],
    amount: [15, 75],
    method: "ach",
  },
];

function generateTransactions(): Transaction[] {
  const out: Transaction[] = [];
  const days = 180;
  const now = new Date();
  now.setHours(9, 0, 0, 0);

  for (let d = days; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const dayOfWeek = date.getDay();
    const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;

    const isPayrollDay = d % 14 === 0;
    if (isPayrollDay) {
      const t = templates.find((tpl) => tpl.category === "payroll")!;
      out.push(makeTx(t, date));
    }

    if (d % 30 === 1) {
      const t = templates.find((tpl) => tpl.category === "taxes")!;
      out.push(makeTx(t, date));
    }

    if (!isWeekday) continue;

    const txCount = Math.floor(range(1, 4));
    for (let i = 0; i < txCount; i++) {
      const pool = templates.filter(
        (t) => t.category !== "payroll" && t.category !== "taxes",
      );
      const weighted = rand() < 0.32 ? templates.find((t) => t.category === "revenue")! : pick(pool);
      out.push(makeTx(weighted, date));
    }
  }

  return out.sort((a, b) => b.date.localeCompare(a.date));
}

let seq = 0;
function makeTx(template: Template, date: Date): Transaction {
  seq += 1;
  const hour = Math.floor(range(7, 19));
  const minute = Math.floor(range(0, 59));
  const txDate = new Date(date);
  txDate.setHours(hour, minute, 0, 0);

  const amount = Number(range(template.amount[0], template.amount[1]).toFixed(2));
  const statusRoll = rand();
  const status: Transaction["status"] =
    statusRoll > 0.97 ? "failed" : statusRoll > 0.9 ? "pending" : "posted";

  const accountId =
    template.category === "transfer" && rand() > 0.5 ? "acc_savings" : "acc_checking";

  return {
    id: `txn_${seq.toString(36)}`,
    date: txDate.toISOString(),
    description: pick(template.counterparties),
    accountId,
    category: template.category,
    direction: template.direction,
    amount,
    status,
    method: template.method,
    memo: rand() > 0.75 ? "Recurring" : undefined,
  };
}

export const transactions: Transaction[] = generateTransactions();

export const categoryLabels: Record<TransactionCategory, string> = {
  payroll: "Payroll",
  revenue: "Revenue",
  software: "Software",
  contractors: "Contractors",
  office: "Office",
  travel: "Travel",
  marketing: "Marketing",
  taxes: "Taxes",
  transfer: "Transfers",
  fees: "Fees",
};
