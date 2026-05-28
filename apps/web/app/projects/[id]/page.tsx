import Link from "next/link";
import { AppShell } from "@/components/AppShell";

const assets = [
  {
    name: "Main Website",
    type: "Website URL",
    value: "https://demo.threatlens.local",
    status: "Ready",
  },
  {
    name: "Auth API",
    type: "API Endpoint",
    value: "https://api.threatlens.local/auth",
    status: "Ready",
  },
];

const findings = [
  {
    title: "Missing HSTS Header",
    severity: "Medium",
    confidence: "High",
  },
  {
    title: "Insecure Cookie Flags",
    severity: "High",
    confidence: "High",
  },
];

export default function ProjectDetailPage() {
  return (
    <AppShell
      title="Demo Web App"
      subtitle="Project detail, monitored assets, latest findings, and passive scan actions."
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/projects"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Back to Projects
          </Link>

          <h2 className="mt-3 text-xl font-semibold text-white">
            Project Overview
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Environment: Staging | Last scan: Today | Risk level: High
          </p>
        </div>

        <button className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500">
          Run Passive Check
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Posture Score</p>
          <p className="mt-3 text-3xl font-bold text-white">76</p>
          <p className="mt-2 text-sm text-slate-500">
            Current security posture
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Open Findings</p>
          <p className="mt-3 text-3xl font-bold text-white">5</p>
          <p className="mt-2 text-sm text-slate-500">
            Need review or remediation
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Assets</p>
          <p className="mt-3 text-3xl font-bold text-white">2</p>
          <p className="mt-2 text-sm text-slate-500">
            Monitored project assets
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Assets</h3>

            <button className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800">
              Add Asset
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {assets.map((asset) => (
              <div
                key={asset.name}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-white">{asset.name}</h4>
                    <p className="mt-1 text-sm text-slate-500">{asset.type}</p>
                    <p className="mt-2 text-xs text-slate-600">
                      {asset.value}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-300">
                    {asset.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Latest Findings
            </h3>

            <Link
              href="/findings"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {findings.map((finding) => (
              <div
                key={finding.title}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <h4 className="font-medium text-white">{finding.title}</h4>

                <div className="mt-3 flex gap-2">
                  <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-300">
                    {finding.severity}
                  </span>

                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                    {finding.confidence}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}