"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Projects", href: "/projects" },
  { name: "Findings", href: "/findings" },
  { name: "Graph", href: "/graph" },
  { name: "Timeline", href: "/timeline" },
  { name: "Remediation", href: "/remediation" },
  { name: "Standards", href: "/standards" },
  { name: "Lab", href: "/lab" },
  { name: "Reports", href: "/reports" },
  { name: "Settings", href: "/settings" },
];

type AppShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-800 bg-slate-950 px-5 py-6 lg:block">
        <Link href="/dashboard" className="block">
          <div className="text-2xl font-bold tracking-tight text-white">
            ThreatLens
          </div>
          <div className="mt-1 text-sm text-slate-400">
            AI Security Investigator
          </div>
        </Link>

        <nav className="mt-10 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            const linkClassName = isActive
              ? "block rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition"
              : "block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white";

            return (
              <Link key={item.href} href={item.href} className={linkClassName}>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="min-h-screen lg:pl-72">
        <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-6 backdrop-blur">
          <p className="text-sm font-medium text-blue-400">
            ThreatLens Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
          {subtitle ? (
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              {subtitle}
            </p>
          ) : null}
        </header>

        <section className="px-6 py-6">{children}</section>
      </main>
    </div>
  );
}
