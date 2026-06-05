"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getProjectScans, getProjectAssets } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function ScansPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [scans, setScans] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projData, scansData, assetsData] = await Promise.all([
        getProject(projectId),
        getProjectScans(projectId),
        getProjectAssets(projectId)
      ]);
      setProject(projData);
      setScans(scansData);
      setAssets(assetsData);
    } catch (err: any) {
      setError(err.message || "Failed to load scan history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  if (loading) {
    return (
      <ProjectShell projectId={projectId} title="Scan History" subtitle="Loading scan history...">
        <LoadingState message="Loading scan history..." />
      </ProjectShell>
    );
  }

  if (error || !project) {
    return (
      <ProjectShell projectId={projectId} title="Scan History" subtitle="Failed to load">
        <ErrorState message={error || "Project not found"} onRetry={loadData} />
      </ProjectShell>
    );
  }
  
  const latestScan = scans.length > 0 ? scans[0] : null;

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Scan History"
      subtitle="View past passive check results and monitor security posture changes."
      tokenUsed={project.tokenUsed}
    >
      <div className="mb-6 flex justify-end gap-3">
        {scans.length >= 2 && (
          <Link
            href={`/projects/${projectId}/scans/compare`}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Compare Scans
          </Link>
        )}
      </div>

      {latestScan && (
        <div className="mb-8 rounded-2xl border border-blue-900 bg-blue-950/30 p-6">
          <h2 className="text-lg font-semibold text-white">Latest Scan Summary</h2>
          <p className="mt-1 text-sm text-slate-400">
            Completed on {new Date(latestScan.createdAt).toLocaleString()}
          </p>
          
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Posture Score</p>
              <p className="mt-1 text-2xl font-bold text-white">{latestScan.postureScore}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Total Findings</p>
              <p className="mt-1 text-2xl font-bold text-white">{latestScan.totalFindings}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">High Risk</p>
              <p className="mt-1 text-2xl font-bold text-red-400">{latestScan.highFindings}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Fixed</p>
              <p className="mt-1 text-2xl font-bold text-green-400">{latestScan.fixedFindings || 0}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
        {scans.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-slate-400">No scan history yet.</p>
            <p className="mt-2 text-sm text-slate-500">Run a passive check from the project overview.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-950/50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Scan ID / Type</th>
                  <th className="px-6 py-4 font-medium">Asset</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium">Findings</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {scans.map((scan) => {
                  const asset = assets.find(a => a.id === scan.assetId);
                  return (
                  <tr key={scan.id} className="transition hover:bg-slate-900/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{scan.id}</div>
                      <div className="mt-1 text-xs text-slate-500">{scan.scanType}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {asset ? (
                        <Link href={`/projects/${projectId}/assets/${asset.id}`} className="hover:text-blue-400">
                          {asset.name}
                        </Link>
                      ) : (
                        scan.assetId || "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(scan.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        scan.postureScore >= 80 ? 'bg-green-500/10 text-green-400' :
                        scan.postureScore >= 60 ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {scan.postureScore}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className="text-red-400" title="High">{scan.highFindings}H</span>
                        <span className="text-orange-400" title="Medium">{scan.mediumFindings}M</span>
                        <span className="text-blue-400" title="Low">{scan.lowFindings}L</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/projects/${projectId}/scans/${scan.id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProjectShell>
  );
}
