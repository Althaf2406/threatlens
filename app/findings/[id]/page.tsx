import Link from "next/link";
import { AppShell } from "@/components/AppShell";

const evidence = [
  {
    source: "Passive HTTP Check",
    detail: "Set-Cookie header detected without Secure attribute.",
    timestamp: "2026-05-28 14:30",
  },
  {
    source: "Passive HTTP Check",
    detail: "Set-Cookie header detected without HttpOnly attribute.",
    timestamp: "2026-05-28 14:30",
  },
  {
    source: "Session Configuration Review",
    detail: "Authentication session cookie is used on login endpoint.",
    timestamp: "2026-05-28 14:31",
  },
];

const remediationTasks = [
  "Add Secure attribute to authentication cookies.",
  "Add HttpOnly attribute to prevent client-side script access.",
  "Set SameSite=Lax or SameSite=Strict based on application flow.",
  "Re-run passive check after deployment to confirm the fix.",
];

const standardMappings = [
  {
    framework: "OWASP",
    control: "Security Misconfiguration",
  },
  {
    framework: "OWASP ASVS",
    control: "Session Management",
  },
  {
    framework: "CWE",
    control: "CWE-614 / CWE-1004",
  },
];

export default function FindingDetailPage() {
  return (
    <AppShell
      title="Insecure Cookie Flags"
      subtitle="Finding detail, evidence, risk explanation, and defensive remediation."
    >
      <div className="mb-6">
        <Link href="/findings" className="text-sm text-blue-400 hover:text-blue-300">
          Back to Findings
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Severity</p>
          <p className="mt-3 text-3xl font-bold text-red-300">High</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Confidence</p>
          <p className="mt-3 text-3xl font-bold text-blue-300">High</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Blast Radius</p>
          <p className="mt-3 text-3xl font-bold text-white">Medium</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Status</p>
          <p className="mt-3 text-3xl font-bold text-green-300">Confirmed</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 xl:col-span-2">
          <h2 className="text-lg font-semibold text-white">Finding Explanation</h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            ThreatLens detected that the authentication cookie is missing important
            security attributes. This is considered a confirmed finding because the
            issue is directly observed from passive HTTP response evidence.
          </p>

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm font-medium text-white">Affected Asset</p>
            <p className="mt-1 text-sm text-slate-400">Auth API</p>
          </div>

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm font-medium text-white">Evidence-Based Claim Status</p>
            <p className="mt-1 text-sm text-slate-400">
              Confirmed. The system found direct evidence from passive HTTP response headers.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold text-white">Standards Mapping</h2>

          <div className="mt-4 space-y-3">
            {standardMappings.map((item) => (
              <div key={item.framework} className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm font-medium text-white">{item.framework}</p>
                <p className="mt-1 text-sm text-slate-500">{item.control}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold text-white">Evidence</h2>

          <div className="mt-5 space-y-3">
            {evidence.map((item) => (
              <div key={item.detail} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm font-medium text-white">{item.source}</p>
                <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
                <p className="mt-2 text-xs text-slate-600">{item.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold text-white">Remediation Checklist</h2>

          <div className="mt-5 space-y-3">
            {remediationTasks.map((task) => (
              <div key={task} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <input type="checkbox" className="mt-1 h-4 w-4" />
                <p className="text-sm text-slate-300">{task}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}