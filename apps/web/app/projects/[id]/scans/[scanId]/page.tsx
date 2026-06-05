"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getProjectScanDetail } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function ScanDetailPage({ params }: { params: Promise<{ id: string, scanId: string }> }) {
  const { id: projectId, scanId } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [scanDetail, setScanDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projData, detailData] = await Promise.all([
        getProject(projectId),
        getProjectScanDetail(projectId, scanId)
      ]);
      setProject(projData);
      setScanDetail(detailData);
    } catch (err: any) {
      setError(err.message || "Failed to load scan details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId, scanId]);

  if (loading) {
    return (
      <ProjectShell projectId={projectId} title="Scan Detail" subtitle="Loading scan details...">
        <LoadingState message="Loading scan details..." />
      </ProjectShell>
    );
  }

  if (error || !project || !scanDetail) {
    return (
      <ProjectShell projectId={projectId} title="Scan Detail" subtitle="Failed to load">
        <ErrorState message={error || "Scan not found"} onRetry={loadData} />
        <div className="mt-4 flex justify-center">
          <Link href={`/projects/${projectId}/scans`} className="text-blue-400 hover:text-blue-300 text-sm">
            &larr; Back to Scan History
          </Link>
        </div>
      </ProjectShell>
    );
  }

  const { scan, asset, findings } = scanDetail;

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title={`Scan: ${scan.id}`}
      subtitle={`Detailed results for the ${scan.scanType} scan on ${new Date(scan.createdAt).toLocaleString()}`}
      tokenUsed={project.tokenUsed}
    >
      <div className="mb-6">
        <Link href={`/projects/${projectId}/scans`} className="text-sm text-blue-400 hover:text-blue-300">
          &larr; Back to Scan History
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Metadata</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
              <p className="font-medium text-white capitalize">{scan.status}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Type</p>
              <p className="font-medium text-white">{scan.scanType}</p>
            </div>
            {asset && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Target Asset</p>
                <Link href={`/projects/${projectId}/assets/${asset.id}`} className="font-medium text-blue-400 hover:text-blue-300">
                  {asset.name} ({asset.type})
                </Link>
              </div>
            )}
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Summary</p>
              <p className="text-sm text-slate-300 mt-1">{scan.summary || "No summary provided."}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Score</p>
              <p className={`mt-1 text-2xl font-bold ${
                scan.postureScore >= 80 ? 'text-green-400' :
                scan.postureScore >= 60 ? 'text-yellow-400' :
                'text-red-400'
              }`}>{scan.postureScore}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Total Findings</p>
              <p className="mt-1 text-2xl font-bold text-white">{scan.totalFindings}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">High Risk</p>
              <p className="mt-1 text-2xl font-bold text-red-400">{scan.highFindings}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Fixed</p>
              <p className="mt-1 text-2xl font-bold text-green-400">{scan.fixedFindings || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-4">Findings Found in Scan</h3>
      
      {findings && findings.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {findings.map((finding: any) => (
            <Link
              key={finding.id}
              href={`/projects/${projectId}/findings/${finding.id}`}
              className="block rounded-xl border border-slate-800 bg-slate-900/70 p-5 transition hover:bg-slate-900"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white">{finding.title}</h4>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  finding.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                  finding.severity === 'High' ? 'bg-red-500/10 text-red-300' :
                  finding.severity === 'Medium' ? 'bg-orange-500/10 text-orange-300' :
                  'bg-blue-500/10 text-blue-300'
                }`}>
                  {finding.severity}
                </span>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2">{finding.description}</p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs text-slate-500">{finding.category}</span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-500">{finding.status}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-8 text-center">
          <p className="text-slate-400">No specific findings linked to this scan.</p>
        </div>
      )}
    </ProjectShell>
  );
}
