import { AppShell } from "@/components/AppShell";
import { MetricCard } from "@/components/MetricCard";
import {
  getProjects,
  getFindingsByProjectId,
  getRemediationTasksByProjectId,
  getUsageLimit,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const projects = getProjects();
  const usage = getUsageLimit();
  
  let totalFindings = 0;
  let totalHighRisk = 0;
  let totalFixed = 0;
  
  const allFindings = [];

  for (const project of projects) {
    const pFindings = getFindingsByProjectId(project.id);
    const pTasks = getRemediationTasksByProjectId(project.id);
    
    totalFindings += pFindings.length;
    totalHighRisk += pFindings.filter(f => f.severity === "High" || f.severity === "Critical").length;
    totalFixed += pTasks.filter(t => t.status === "fixed").length;
    
    pFindings.forEach(f => {
      allFindings.push({
        ...f,
        projectName: project.name,
      });
    });
  }
  
  // Sort by created descending
  allFindings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const recentFindings = allFindings.slice(0, 5);
  const averageScore = projects.reduce((acc, p) => acc + p.postureScore, 0) / (projects.length || 1);

  return (
    <AppShell
      title="Dashboard"
      subtitle="Overview security posture, latest findings, scan activity, and remediation progress."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Projects" value={projects.length.toString()} description={`Out of ${usage.projectLimit} limit`} />
        <MetricCard title="Open Findings" value={totalFindings.toString()} description="Across all projects" />
        <MetricCard title="High Risk" value={totalHighRisk.toString()} description="Findings with high severity" />
        <MetricCard title="Fixed Issues" value={totalFixed.toString()} description="Completed remediation tasks" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Findings</h2>
            <span className="text-sm text-slate-500">Across workspace</span>
          </div>

          <div className="mt-5 space-y-3">
            {recentFindings.length === 0 ? (
              <p className="text-sm text-slate-500">No findings available.</p>
            ) : (
              recentFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-medium text-white">{finding.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Project: {finding.projectName}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        finding.severity === 'High' ? 'bg-red-500/10 text-red-300' : 
                        finding.severity === 'Medium' ? 'bg-orange-500/10 text-orange-300' : 
                        'bg-blue-500/10 text-blue-300'
                      }`}>
                        {finding.severity}
                      </span>
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                        {finding.confidence}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold text-white">Workspace Posture</h2>
          <p className="mt-2 text-sm text-slate-400">
            Average posture score across all active projects based on severity and findings.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-950 p-6 text-center">
            <p className="text-5xl font-bold text-blue-400">{Math.round(averageScore)}</p>
            <p className="mt-2 text-sm text-slate-500">Average Score</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
