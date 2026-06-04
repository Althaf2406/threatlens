"use client";

import { use } from "react";
import Link from "next/link";
import { ProjectShell } from "@/components/ProjectShell";
import { 
  getProjectById, 
  getFindingById, 
  getAssetsByProjectId, 
  getEvidencesByFindingId,
  getRemediationTasksByFindingId,
  getStandardMappingsByFindingId
} from "@/lib/mock-data";

export default function FindingDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string, findingId: string }> 
}) {
  const { id: projectId, findingId } = use(params);
  
  const project = getProjectById(projectId);
  const finding = getFindingById(findingId);
  const assets = getAssetsByProjectId(projectId);

  if (!project || !finding || finding.projectId !== projectId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Finding Not Found</h1>
          <p className="mt-2 text-slate-400">The requested finding does not exist in this project.</p>
          <Link href={`/projects/${projectId}/findings`} className="mt-6 inline-block rounded-xl bg-blue-600 px-4 py-2 font-medium text-white">
            Back to Findings
          </Link>
        </div>
      </div>
    );
  }

  const asset = assets.find(a => a.id === finding.assetId);
  const evidences = getEvidencesByFindingId(finding.id);
  const remediationTasks = getRemediationTasksByFindingId(finding.id);
  const standards = getStandardMappingsByFindingId(finding.id);

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title={finding.title}
      subtitle={`Category: ${finding.category} • Status: ${finding.status}`}
      tokenUsed={project.tokenUsed}
    >
      <div className="mb-6 flex">
        <Link href={`/projects/${projectId}/findings`} className="text-sm text-blue-400 hover:text-blue-300">
          &larr; Back to Findings
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Finding Details */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold text-white">Description</h2>
            <p className="mt-3 text-slate-300 leading-relaxed">
              {finding.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                <p className="text-xs text-slate-500">Severity</p>
                <p className={`mt-1 font-semibold ${
                  finding.severity === 'High' ? 'text-red-400' : 
                  finding.severity === 'Medium' ? 'text-orange-400' : 'text-blue-400'
                }`}>
                  {finding.severity}
                </p>
              </div>
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                <p className="text-xs text-slate-500">Confidence</p>
                <p className="mt-1 font-semibold text-white">{finding.confidence}</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                <p className="text-xs text-slate-500">Blast Radius</p>
                <p className="mt-1 font-semibold text-white">{finding.blastRadius}</p>
              </div>
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
                <p className="text-xs text-slate-500">Claim Status</p>
                <p className="mt-1 font-semibold text-white">{finding.status}</p>
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold text-white">Evidence List</h2>
            <p className="mt-1 text-sm text-slate-400">Claims supported by the following evidences.</p>
            
            <div className="mt-5 space-y-4">
              {evidences.length === 0 ? (
                <p className="text-sm text-slate-500">Insufficient evidence.</p>
              ) : (
                evidences.map(evd => (
                  <div key={evd.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{evd.source}</span>
                      <span className="text-xs text-slate-500">{new Date(evd.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-300 font-mono bg-slate-900 p-3 rounded-lg border border-slate-800">
                      {evd.detail}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Affected Asset */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold text-white">Affected Asset</h2>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <h4 className="font-medium text-white">{asset?.name || finding.assetId}</h4>
              <p className="mt-1 text-sm text-slate-500">{asset?.type}</p>
              <p className="mt-2 text-xs text-slate-600 break-all">{asset?.value}</p>
            </div>
          </div>

          {/* Remediation Checklist */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold text-white">Remediation Checklist</h2>
            <div className="mt-4 space-y-3">
              {remediationTasks.length === 0 ? (
                <p className="text-sm text-slate-500">No tasks defined.</p>
              ) : (
                remediationTasks.map(task => (
                  <div key={task.id} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <input type="checkbox" checked={task.status === 'fixed'} readOnly className="mt-1 rounded bg-slate-800 border-slate-700" />
                    <div>
                      <p className={`text-sm ${task.status === 'fixed' ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                        {task.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 capitalize">{task.priority} Priority</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Standards Mapping */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold text-white">Standards Mapping</h2>
            <div className="mt-4 space-y-3">
              {standards.length === 0 ? (
                <p className="text-sm text-slate-500">No standards mapped.</p>
              ) : (
                standards.map(std => (
                  <div key={std.id} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <div className="flex gap-2 mb-1">
                      <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-300">
                        {std.framework}
                      </span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                        {std.control}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{std.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ProjectShell>
  );
}
