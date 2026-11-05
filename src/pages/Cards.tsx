import { useState } from "react";
import { Topbar } from "../components/layout/Topbar";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { CardTile } from "../components/cards/CardTile";
import { IssueCardModal } from "../components/cards/IssueCardModal";
import { cards as initialCards } from "../data/cards";
import { formatCurrency } from "../lib/format";
import { Plus } from "lucide-react";

export default function Cards() {
  const [cards, setCards] = useState(initialCards);
  const [issueOpen, setIssueOpen] = useState(false);

  const totalLimit = cards.reduce((sum, c) => sum + c.limit, 0);
  const totalSpent = cards.reduce((sum, c) => sum + c.spent, 0);
  const activeCount = cards.filter((c) => c.status === "active").length;

  function toggleFreeze(id: string) {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "frozen" ? "active" : "frozen" } : c)),
    );
  }

  return (
    <div>
      <Topbar title="Cards" subtitle="Manage virtual and physical cards" />

      <div className="space-y-6 px-6 py-6 md:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card><CardContent>
            <p className="text-sm text-[var(--text-secondary)]">Active cards</p>
            <p className="mt-2 text-2xl font-semibold">{activeCount} / {cards.length}</p>
          </CardContent></Card>
          <Card><CardContent>
            <p className="text-sm text-[var(--text-secondary)]">Spent this month</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{formatCurrency(totalSpent)}</p>
          </CardContent></Card>
          <Card><CardContent>
            <p className="text-sm text-[var(--text-secondary)]">Combined limit</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{formatCurrency(totalLimit)}</p>
          </CardContent></Card>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-[var(--text-secondary)]">All cards</h2>
          <Button variant="primary" size="sm" onClick={() => setIssueOpen(true)}>
            <Plus size={15} />
            Issue card
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <CardTile key={card.id} card={card} onToggleFreeze={toggleFreeze} />
          ))}
        </div>
      </div>

      <IssueCardModal
        open={issueOpen}
        onClose={() => setIssueOpen(false)}
        onIssue={(card) => setCards((prev) => [card, ...prev])}
      />
    </div>
  );
}
