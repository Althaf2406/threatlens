import Link from "next/link";
import { AppShell } from "@/components/AppShell";

const projects = [
  {
    id: "proj-001",
    name: "Demo Web App",
    environment: "Staging",
    assets: 2,
    findings: 5,
    risk: "High",
    updatedAt: "Today",
  },
  {
    id: "proj-002",
    name: "Public API Service",
    environment: "Demo",
    assets: 1,
    findings: 3,
    risk: "Medium",
    updatedAt: "Yesterday",
  },
  {
    id: "proj-003",
    name: "Student Portfolio App",
    environment: "Lab",
    assets: 1,
    findings: 1,
    risk: "Low",
    updatedAt: "3 days ago",
  },
];

export default function ProjectsPage() {
  return (
    <AppShell
      title="Projects"
      subtitle="Manage security workspaces and monitored assets."
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Security Projects</h2>
          <p className="mt-1 text-sm text-slate-400">
            Each project contains assets, scans, findings, and reports.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Create Project
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-blue-500/60 hover:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {project.environment} environment
                </p>
              </div>

              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                {project.risk}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-2xl font-bold text-white">{project.assets}</p>
                <p className="mt-1 text-xs text-slate-500">Assets</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-2xl font-bold text-white">{project.findings}</p>
                <p className="mt-1 text-xs text-slate-500">Findings</p>
              </div>
            </div>

            <p className="mt-5 text-xs text-slate-500">
              Last updated: {project.updatedAt}
            </p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
