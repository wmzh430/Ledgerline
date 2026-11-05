import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import type { TransactionStatus, CardStatus } from "../../types";

const statusStyles: Record<TransactionStatus | CardStatus, string> = {
  posted: "bg-[#e9f7e9] text-[#006300]",
  active: "bg-[#e9f7e9] text-[#006300]",
  pending: "bg-[#fef3dd] text-[#8a5a00]",
  failed: "bg-[#fbe9e9] text-[#a12121]",
  frozen: "bg-[#eef0f4] text-[#52514e]",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: TransactionStatus | CardStatus;
}

export function StatusBadge({ status, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        statusStyles[status],
        className,
      )}
      {...props}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function CategoryTag({ children, className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-[var(--surface-sunken)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)]",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
