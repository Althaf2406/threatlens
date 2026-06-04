"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getProjectFindings, getProjectAssets } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

export default function FindingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [severityFilter, setSeverityFilter] = useState("All Severities");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projData, findingsData, assetsData] = await Promise.all([
        getProject(projectId),
        getProjectFindings(projectId),
        getProjectAssets(projectId)
      ]);
      
      setProject(projData);
      setFindings(findingsData);
      setAssets(assetsData);
    } catch (err: any) {
      setError(err.message || "Failed to load findings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  if (loading) {
    return (
      <ProjectShell projectId={projectId} projectName="Loading..." title="Findings" subtitle="Loading project findings...">
        <LoadingState message="Loading findings..." />
      </ProjectShell>
    );
  }

  if (error || !project) {
    return (
      <ProjectShell projectId={projectId} projectName="Error" title="Findings" subtitle="Failed to load">
        <ErrorState message={error || "Project not found"} onRetry={loadData} />
      </ProjectShell>
    );
  }

  const filteredFindings = findings.filter(f => {
    if (severityFilter !== "All Severities" && f.severity !== severityFilter) return false;
    if (statusFilter !== "All Statuses" && f.status !== statusFilter) return false;
    return true;
  });

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Findings"
      subtitle="Review vulnerabilities and security issues found in this project."
      tokenUsed={project.tokenUsed}
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="flex gap-4">
          <select 
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300"
          >
            <option>All Severities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300"
          >
            <option>All Statuses</option>
            <option>Open</option>
            <option>Confirmed</option>
            <option>Remediated</option>
          </select>
        </div>
        <div className="text-sm text-slate-400">
          Showing {filteredFindings.length} finding(s)
        </div>
      </div>

      <div className="grid gap-4">
        {filteredFindings.length === 0 ? (
          <EmptyState 
            title="No findings" 
            message={findings.length === 0 ? "Your project looks secure. No vulnerabilities found." : "No findings match the current filters."}
          />
        ) : (
          filteredFindings.map((finding) => {
            const asset = assets.find(a => a.id === finding.assetId);
            return (
              <Link
                key={finding.id}
                href={`/projects/${projectId}/findings/${finding.id}`}
                className="group flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 transition hover:border-blue-500/60 hover:bg-slate-900 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400">
                      {finding.title}
                    </h3>
                    <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                      {finding.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Asset: <span className="font-medium text-slate-300">{asset?.name || finding.assetId}</span>
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                    {finding.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-end md:gap-3">
                  <div className="flex gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      finding.severity === 'High' || finding.severity === 'Critical' ? 'bg-red-500/10 text-red-300' : 
                      finding.severity === 'Medium' ? 'bg-orange-500/10 text-orange-300' : 
                      'bg-blue-500/10 text-blue-300'
                    }`}>
                      Severity: {finding.severity}
                    </span>
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                      Confidence: {finding.confidence}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs text-slate-500">
                    <span>Blast Radius: {finding.blastRadius}</span>
                    <span>&bull;</span>
                    <span>Status: {finding.status}</span>
                    {finding.evidenceIds && (
                      <>
                        <span>&bull;</span>
                        <span>{finding.evidenceIds.length} Evidence</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </ProjectShell>
  );
}