"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ProjectShell } from "@/components/ProjectShell";
import { getProjectById, getRemediationTasksByProjectId, getFindingsByProjectId } from "@/lib/mock-data";

export default function RemediationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const project = getProjectById(projectId);
  const tasks = getRemediationTasksByProjectId(projectId);
  const findings = getFindingsByProjectId(projectId);
  
  const [localTasks, setLocalTasks] = useState(tasks);

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Project Not Found</h1>
          <p className="mt-2 text-slate-400">The project {projectId} does not exist.</p>
          <Link href="/projects" className="mt-6 inline-block rounded-xl bg-blue-600 px-4 py-2 font-medium text-white">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setLocalTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const statusGroups = {
    open: localTasks.filter(t => t.status === "open"),
    in_progress: localTasks.filter(t => t.status === "in_progress"),
    fixed: localTasks.filter(t => t.status === "fixed"),
    accepted_risk: localTasks.filter(t => t.status === "accepted_risk"),
    dismissed: localTasks.filter(t => t.status === "dismissed")
  };

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Remediation Tracker"
      subtitle="Track and manage security fixes and accepted risks."
      tokenUsed={project.tokenUsed}
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Total Tasks</p>
          <p className="mt-2 text-2xl font-bold text-white">{localTasks.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Open / In Progress</p>
          <p className="mt-2 text-2xl font-bold text-blue-400">{statusGroups.open.length + statusGroups.in_progress.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Fixed</p>
          <p className="mt-2 text-2xl font-bold text-green-400">{statusGroups.fixed.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Accepted Risk</p>
          <p className="mt-2 text-2xl font-bold text-orange-400">{statusGroups.accepted_risk.length}</p>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(statusGroups).filter(([_, groupTasks]) => groupTasks.length > 0).map(([status, groupTasks]) => (
          <div key={status} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold text-white capitalize flex items-center gap-2">
              {status.replace("_", " ")}
              <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full">{groupTasks.length}</span>
            </h2>
            <div className="mt-4 space-y-3">
              {groupTasks.map(task => {
                const finding = findings.find(f => f.id === task.findingId);
                return (
                  <div key={task.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-xl p-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-200">{task.title}</h3>
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        <span className={`px-2 py-1 rounded capitalize font-medium ${
                          task.priority === 'High' ? 'bg-red-500/10 text-red-400' :
                          task.priority === 'Medium' ? 'bg-orange-500/10 text-orange-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {task.priority} Priority
                        </span>
                        {finding && (
                          <Link href={`/projects/${projectId}/findings/${finding.id}`} className="hover:text-blue-400 hover:underline">
                            Finding: {finding.title}
                          </Link>
                        )}
                      </div>
                    </div>
                    <select 
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="fixed">Fixed</option>
                      <option value="accepted_risk">Accepted Risk</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ProjectShell>
  );
}