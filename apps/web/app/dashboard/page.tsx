import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getProjects, getUsageSettings, getProjectFindings } from "@/lib/api";
import ErrorState from "@/components/ErrorState";

export default async function DashboardPage() {
  let projects: any[] = [];
  let usage: any = null;
  let allFindings: any[] = [];
  let errorMsg: string | null = null;

  try {
    // Parallel fetch projects and usage
    const [projectsData, usageData] = await Promise.all([
      getProjects(),
      getUsageSettings()
    ]);

    projects = projectsData;
    usage = usageData;

    // Fetch findings for all projects to aggregate
    const findingsPromises = projects.map(p => getProjectFindings(p.id));
    const findingsResults = await Promise.all(findingsPromises);

    // Attach project info to findings for global display
    findingsResults.forEach((projectFindings: any[], idx) => {
      const projectName = projects[idx].name;
      const enriched = projectFindings.map(f => ({ ...f, projectName }));
      allFindings = [...allFindings, ...enriched];
    });

  } catch (err: any) {
    errorMsg = err.message || "Failed to load dashboard data.";
  }

  let detectionRules: any[] = [];
  try {
    const { getDetectionRules } = await import("@/lib/api");
    detectionRules = await getDetectionRules();
  } catch (err) {
    // Likely not an admin, ignore
  }

  if (errorMsg) {
    return (
      <AppShell title="Dashboard" subtitle="Global overview">
        <ErrorState message={errorMsg} />
      </AppShell>
    );
  }

  const highRiskFindings = allFindings.filter(
    (f) => f.severity === "High" || f.severity === "Critical"
  );

  // Recent high risk
  const recentHighRisk = [...highRiskFindings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Recent projects
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 3);

  return (
    <AppShell
      title="Dashboard"
      subtitle="Global overview of your security workspaces."
    >
      <div data-tour="dashboard-overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">Total Projects</p>
            <span className="text-xs font-medium text-slate-500">
              {projects.length} / {usage?.projectLimit || 3} Limit
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">{projects.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">Token Usage</p>
            <span className="text-xs font-medium text-slate-500">
              {usage?.tokenLimit || 1000} Limit
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            {projects.reduce((acc, p) => acc + (p.tokenUsed || 0), 0)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm font-medium text-slate-400">Open Findings</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {allFindings.filter(f => f.status === 'open').length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm font-medium text-slate-400">High Risk</p>
          <p className="mt-2 text-3xl font-bold text-red-400">
            {highRiskFindings.filter(f => f.status === 'open').length}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Security Improvement Tracking</h3>
          <p className="mt-1 text-sm text-slate-400">Scan histories and security posture trends are available within each project.</p>
        </div>
        <Link href="/projects" className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 whitespace-nowrap">
          View Projects &rarr;
        </Link>
      </div>

      {detectionRules.length > 0 && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">System Admin: Detection Rules Engine</h3>
            <Link href="/settings" className="text-sm text-blue-400 hover:text-blue-300">
              Manage Rules
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Total Configured</p>
              <p className="mt-1 text-2xl font-bold text-white">{detectionRules.length}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Active Rules</p>
              <p className="mt-1 text-2xl font-bold text-green-400">{detectionRules.filter(r => r.enabled).length}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Disabled</p>
              <p className="mt-1 text-2xl font-bold text-slate-400">{detectionRules.filter(r => !r.enabled).length}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Recent High Risk Findings
            </h3>
          </div>

          <div className="mt-5 space-y-3">
            {recentHighRisk.length === 0 ? (
              <p className="text-sm text-slate-500">No high risk findings detected.</p>
            ) : (
              recentHighRisk.map((finding) => (
                <Link
                  key={finding.id}
                  href={`/projects/${finding.projectId}/findings/${finding.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:bg-slate-900"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {finding.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Project: {finding.projectName} • {new Date(finding.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
                    {finding.severity}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
            <Link
              href="/projects"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-slate-500">No projects available.</p>
            ) : (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:bg-slate-900"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {project.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {project.environment}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${project.riskLevel === 'High' ? 'bg-red-500/10 text-red-300' :
                      project.riskLevel === 'Medium' ? 'bg-orange-500/10 text-orange-300' :
                        'bg-blue-500/10 text-blue-300'
                    }`}>
                    {project.riskLevel} Risk
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
