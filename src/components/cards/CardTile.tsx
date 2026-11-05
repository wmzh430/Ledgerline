import { useState } from "react";
import { Eye, EyeOff, Snowflake } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { formatCurrency } from "../../lib/format";
import { cn } from "../../lib/utils";
import type { VirtualCard } from "../../types";

function meterColor(ratio: number) {
  if (ratio >= 0.9) return "var(--status-critical)";
  if (ratio >= 0.7) return "var(--status-warning)";
  return "var(--brand)";
}

export function CardTile({ card, onToggleFreeze }: { card: VirtualCard; onToggleFreeze: (id: string) => void }) {
  const [revealed, setRevealed] = useState(false);
  const ratio = card.spent / card.limit;
  const frozen = card.status === "frozen";

  return (
    <Card className="overflow-hidden p-0">
      <div
        className={cn(
          "relative flex h-36 flex-col justify-between p-5 text-white",
          frozen ? "bg-[#3a4357]" : "bg-gradient-to-br from-[#121a2e] to-[#1c2742]",
        )}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">{card.label}</p>
            <p className="mt-0.5 text-xs opacity-60">{card.holder}</p>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide opacity-80">{card.network}</span>
        </div>
        <div className="flex items-end justify-between">
          <p className="font-mono text-lg tracking-widest">
            {revealed ? card.number : `•••• •••• •••• ${card.last4}`}
          </p>
          <p className="text-xs opacity-70">{revealed ? card.expiry : "••/••"}</p>
        </div>
        {frozen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
            <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--text-primary)]">
              <Snowflake size={13} /> Frozen
            </span>
          </div>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div>
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Spent this month</span>
            <span className="font-medium tabular-nums text-[var(--text-secondary)]">
              {formatCurrency(card.spent)} / {formatCurrency(card.limit)}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: `color-mix(in srgb, ${meterColor(ratio)} 16%, white)` }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(ratio * 100, 100)}%`, background: meterColor(ratio) }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setRevealed((r) => !r)}>
            {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
            {revealed ? "Hide" : "Reveal"}
          </Button>
          <Button size="sm" variant={frozen ? "primary" : "secondary"} onClick={() => onToggleFreeze(card.id)}>
            <Snowflake size={14} />
            {frozen ? "Unfreeze" : "Freeze"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
