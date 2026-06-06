"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/hooks/useAuth";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Projects", href: "/projects" },
  { name: "Settings", href: "/settings" },
];

type AppShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [projectsCount, setProjectsCount] = useState(0);
  const [tokensUsed, setTokensUsed] = useState(0);

  useEffect(() => {
    async function loadUsage() {
      try {
        const { getProjects } = await import("@/lib/api");
        const projectsData = await getProjects();
        setProjectsCount(projectsData.length);
        const used = projectsData.reduce((acc: number, p: any) => acc + (p.tokenUsed || 0), 0);
        setTokensUsed(used);
      } catch (e) {
        console.error("Failed to load sidebar usage:", e);
      }
    }
    if (user) {
      loadUsage();
    }
  }, [user]);

  const formatTokens = (val: number) => {
    if (val >= 1000) {
      return (val / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return val.toString();
  };

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

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Usage
          </p>
          <p className="mt-2 text-sm text-white">
            Projects: {projectsCount} / {user?.projectLimit || 3}
          </p>
          <p className="mt-1 text-sm text-white">
            Tokens: {formatTokens(tokensUsed)} / {formatTokens(user?.tokenLimit || 1000)}
          </p>
          <p className="mt-1 text-xs text-blue-400">
            Plan: {user ? user.planName.charAt(0).toUpperCase() + user.planName.slice(1) : "Free"}
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith("/projects") && item.name === "Projects");

            const linkClassName = isActive
              ? "block rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition"
              : "block rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white";

            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={linkClassName}
                data-tour={item.name === "Projects" ? "nav-projects" : undefined}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <UserMenu />
      </aside>

      <main className="min-h-screen lg:pl-72">
        <header className="border-b border-slate-800 bg-slate-950/80 px-6 py-6 backdrop-blur">
          <p className="text-sm font-medium text-blue-400">
            ThreatLens Workspace
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
