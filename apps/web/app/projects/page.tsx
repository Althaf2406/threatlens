import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getProjects, getProjectAssets, getProjectFindings } from "@/lib/api";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

export default async function ProjectsPage() {
  let projects = [];
  
  try {
    const projectsData = await getProjects();
    
    // Fetch counts for each project
    projects = await Promise.all(
      projectsData.map(async (p: any) => {
        try {
          const assets = await getProjectAssets(p.id);
          const findings = await getProjectFindings(p.id);
          
          return {
            ...p,
            assetCount: assets.length || 0,
            findingCount: findings.length || 0,
          };
        } catch (e) {
          // Fallback if related data fails
          return {
            ...p,
            assetCount: 0,
            findingCount: 0,
          };
        }
      })
    );
  } catch (error) {
    return (
      <AppShell title="Projects" subtitle="Manage security workspaces and monitored assets.">
        <ErrorState message="Failed to connect to backend API to load projects." />
      </AppShell>
    );
  }

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

      {projects.length === 0 ? (
        <EmptyState 
          title="No projects found" 
          message="Create your first project to start investigating." 
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          {projects.map((project: any) => (
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
                    {project.environment || 'Production'} environment
                  </p>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  project.riskLevel === 'High' ? 'bg-red-500/10 text-red-300' : 
                  project.riskLevel === 'Medium' ? 'bg-orange-500/10 text-orange-300' : 
                  'bg-blue-500/10 text-blue-300'
                }`}>
                  {project.riskLevel || 'Low'}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-2xl font-bold text-white">{project.assetCount}</p>
                  <p className="mt-1 text-xs text-slate-500">Assets</p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-2xl font-bold text-white">{project.findingCount}</p>
                  <p className="mt-1 text-xs text-slate-500">Findings</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Last updated: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-xs text-slate-500">
                  Score: {project.postureScore || 0}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
