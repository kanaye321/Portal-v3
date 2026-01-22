import { ReactNode } from "react";
import { TopNav } from "./TopNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <TopNav />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
