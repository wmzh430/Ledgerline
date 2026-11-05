import { Bell } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-black/[0.06] bg-[var(--surface-page)] px-6 py-5 md:px-10">
      <div>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-[var(--text-muted)]">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative rounded-full p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)]"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--status-critical)]" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--series-7)] text-xs font-semibold text-white">
            MA
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-tight">M. Ahmed</p>
            <p className="text-xs leading-tight text-[var(--text-muted)]">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
