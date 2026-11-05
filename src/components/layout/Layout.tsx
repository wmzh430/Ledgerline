import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="min-h-screen bg-[var(--surface-page)]">
      <Sidebar />
      <main className="pb-20 md:ml-60 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
