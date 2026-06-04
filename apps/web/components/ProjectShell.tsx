"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type ProjectShellProps = {
  children: ReactNode;
  projectId: string;
  projectName?: string;
  title: string;
  subtitle?: string;
  tokenUsed?: number;
};

export function ProjectShell({
  children,
  projectId,
  projectName,
  title,
  subtitle,
  tokenUsed,
}: ProjectShellProps) {
  const pathname = usePathname();

  const projectNavigationItems = [
    { name: "Overview", href: `/projects/${projectId}` },
    { name: "Findings", href: `/projects/${projectId}/findings` },
    { name: "Timeline", href: `/projects/${projectId}/timeline` },
    { name: "Graph", href: `/projects/${projectId}/graph` },
    { name: "Lab", href: `/projects/${projectId}/lab` },
    { name: "Remediation", href: `/projects/${projectId}/remediation` },
    { name: "Standards", href: `/projects/${projectId}/standards` },
    { name: "Reports", href: `/projects/${projectId}/reports` },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-800 bg-slate-950 px-5 py-6 lg:block">
        <Link href="/projects" className="text-sm text-blue-400 hover:text-blue-300">
          &larr; Back to Projects
        </Link>

        <div className="mt-6">
          <div className="text-2xl font-bold tracking-tight text-white">
            ThreatLens
          </div>
          <div className="mt-1 text-sm text-slate-400">
            Project Workspace
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Current Project
          </p>
          <p className="mt-2 text-sm font-medium text-white">{projectName || projectId}</p>
          <p className="mt-1 text-xs text-slate-500">
            Tokens used: {tokenUsed ? (tokenUsed / 1000).toFixed(1) + 'k' : '0k'}
          </p>
        </div>

        <nav className="mt-8 space-y-2">
          {projectNavigationItems.map((item) => {
            const isActive = pathname === item.href || (item.name !== "Overview" && pathname.startsWith(item.href));

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
            Project: {projectName || projectId}
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
