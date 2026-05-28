import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";

const recentFindings = [
  {
    title: "Missing Content Security Policy",
    severity: "Medium",
    confidence: "High",
    asset: "demo-web-app",
  },
  {
    title: "Insecure Cookie Flags",
    severity: "High",
    confidence: "High",
    asset: "auth-service",
  },
  {
    title: "Permissive CORS Configuration",
    severity: "High",
    confidence: "Medium",
    asset: "public-api",
  },
];

export default function DashboardPage() {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Overview security posture, latest findings, scan activity, and remediation progress."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Projects" value="3" description="Active security workspaces" />
        <MetricCard title="Open Findings" value="12" description="Findings that need review" />
        <MetricCard title="High Risk" value="4" description="Findings with high severity" />
        <MetricCard title="Fixed Issues" value="8" description="Completed remediation tasks" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Findings</h2>
            <span className="text-sm text-slate-500">Latest scan result</span>
          </div>

          <div className="mt-5 space-y-3">
            {recentFindings.map((finding) => (
              <div
                key={finding.title}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-medium text-white">{finding.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Affected asset: {finding.asset}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
                      {finding.severity}
                    </span>
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                      {finding.confidence}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold text-white">Security Posture</h2>
          <p className="mt-2 text-sm text-slate-400">
            Current project posture score based on severity, confidence, blast radius,
            and remediation progress.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-950 p-6 text-center">
            <p className="text-5xl font-bold text-blue-400">76</p>
            <p className="mt-2 text-sm text-slate-500">Posture Score</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
