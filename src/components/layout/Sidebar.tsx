import { NavLink } from "react-router-dom";
import { LayoutGrid, ArrowLeftRight, CreditCard, Landmark } from "lucide-react";
import { cn } from "../../lib/utils";

const links = [
  { to: "/", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight, end: false },
  { to: "/cards", label: "Cards", icon: CreditCard, end: false },
];

export function Sidebar() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-[var(--sidebar-bg)] md:flex">
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)]">
            <Landmark size={18} className="text-white" />
          </div>
          <span className="text-[15px] font-semibold text-white">Ledgerline</span>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--sidebar-active)] text-white"
                    : "text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-active)]/60 hover:text-white",
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mx-3 mb-4 rounded-xl bg-[var(--sidebar-active)] p-4">
          <p className="text-xs font-medium text-white">Clearwater Labs, Inc.</p>
          <p className="mt-1 text-xs text-[var(--sidebar-muted)]">Business Checking · 8814062931</p>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-black/[0.06] bg-white py-2 md:hidden">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 rounded-lg px-4 py-1.5 text-xs font-medium",
                isActive ? "text-[var(--brand)]" : "text-[var(--text-muted)]",
              )
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
