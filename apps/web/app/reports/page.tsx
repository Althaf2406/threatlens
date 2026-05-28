import { AppShell } from "@/components/AppShell";

export default function Page() {
  return (
    <AppShell title="Reports" subtitle="Generate evidence-based security investigation reports.">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Reports</h2>
        <p className="mt-2 text-sm text-slate-400">
          This page is ready. The feature implementation will be added in the next step.
        </p>
      </div>
    </AppShell>
  );
}
