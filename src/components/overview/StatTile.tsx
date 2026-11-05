import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "../ui/Card";
import { cn } from "../../lib/utils";

interface StatTileProps {
  label: string;
  value: string;
  delta?: { value: string; direction: "up" | "down"; isGood: boolean };
  icon?: ReactNode;
}

export function StatTile({ label, value, delta, icon }: StatTileProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums text-[var(--text-primary)]">{value}</p>
      {delta && (
        <div
          className={cn(
            "mt-2 inline-flex items-center gap-1 text-xs font-medium",
            delta.isGood ? "text-[var(--status-good-text)]" : "text-[var(--status-critical)]",
          )}
        >
          {delta.direction === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {delta.value}
          <span className="font-normal text-[var(--text-muted)]">vs last 30 days</span>
        </div>
      )}
    </Card>
  );
}
