# Ledgerline

A modern banking dashboard concept inspired by platforms like Mercury and Slash — account overview, transaction management, and cash-flow visualization for a business banking customer.

## Running it

```bash
npm install
npm run dev
```

Build for production with `npm run build`.

## Features

- **Overview** — total cash position, 30-day money in/out, per-account balances (checking, savings, treasury), a cash-flow trend chart, income vs. expenses, spend-by-category breakdown, and a recent-activity feed.
- **Transactions** — searchable, filterable (account, category, status, date range), sortable transaction history over 180 days of generated activity, with a detail drawer per transaction and CSV export.
- **Cards** — virtual card management with freeze/unfreeze, spend-limit meters, number reveal, and an "issue card" flow.
- Fully responsive: a fixed sidebar on desktop, a bottom tab bar on mobile.

## Tech stack

- **React 19 + TypeScript + Vite** — app framework and build tooling.
- **Tailwind CSS v4** — styling, with design tokens (color, surfaces, status colors) defined as CSS custom properties in [src/index.css](src/index.css).
- **Recharts** — the cash-flow area chart, income/expense bars, and category donut.
- **React Router** — client-side routing between Overview, Transactions, and Cards.
- **lucide-react** — icons.

There is no backend. Account, transaction, and card data lives in a typed mock layer ([src/data/](src/data)) generated with a seeded PRNG so the data is realistic (payroll cadence, revenue, vendor spend, failed/pending states) and reproducible across runs. All interactivity — search, filtering, sorting, pagination, card freeze, CSV export — is real client-side state, not static mockups.

## Project structure

```
src/
  components/
    layout/        sidebar, topbar, page shell
    ui/             shared primitives (Card, Button, Badge, Drawer, Pagination)
    charts/         Recharts wrappers
    overview/       overview-page widgets
    transactions/   table, filters, detail view
    cards/          card tile, issue-card modal
  data/             mock accounts, cards, and generated transactions
  hooks/            transaction filtering/sorting state
  lib/              formatting, cash-flow/category analytics, class-name helper
  pages/            route-level views
```
