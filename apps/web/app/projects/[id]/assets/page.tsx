"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getProjectAssets } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function AssetsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projData, assetsData] = await Promise.all([
        getProject(projectId),
        getProjectAssets(projectId)
      ]);
      setProject(projData);
      setAssets(assetsData);
    } catch (err: any) {
      setError(err.message || "Failed to load assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  if (loading) {
    return (
      <ProjectShell projectId={projectId} projectName="Loading..." title="Assets">
        <LoadingState message="Loading assets..." />
      </ProjectShell>
    );
  }

  if (error || !project) {
    return (
      <ProjectShell projectId={projectId} projectName="Error" title="Assets">
        <ErrorState message={error || "Failed to load assets"} onRetry={loadData} />
      </ProjectShell>
    );
  }

  const activeAssets = assets.filter(a => a.status?.toLowerCase() !== 'inactive').length;
  const confirmedAssets = assets.filter(a => a.ownershipConfirmed).length;
  const needsReview = assets.filter(a => a.status?.toLowerCase() === 'needs_review').length;

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Assets"
      subtitle="Manage and review the assets monitored by this project."
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Asset Inventory</h2>
        </div>
        <Link
          href={`/projects/${projectId}/assets/new`}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
          data-tour="add-asset-button"
        >
          Add Asset
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Total Assets</p>
          <p className="mt-3 text-3xl font-bold text-white">{assets.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Active Assets</p>
          <p className="mt-3 text-3xl font-bold text-white">{activeAssets}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Ownership Confirmed</p>
          <p className="mt-3 text-3xl font-bold text-white">{confirmedAssets}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Needs Review</p>
          <p className="mt-3 text-3xl font-bold text-white">{needsReview}</p>
        </div>
      </div>

      <div data-tour="assets-list" className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
        {assets.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No assets yet. Add a website, API endpoint, repository, or demo target to start defensive analysis.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Type & Value</th>
                  <th className="px-6 py-4 font-medium">Environment</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Ownership</th>
                  <th className="px-6 py-4 font-medium">Last Checked</th>
                  <th className="px-6 py-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {assets.map((asset) => (
                  <tr key={asset.id} className="transition hover:bg-slate-800/20">
                    <td className="px-6 py-4 font-medium text-white">{asset.name}</td>
                    <td className="px-6 py-4">
                      <span className="block text-xs text-slate-500 mb-1">{asset.type}</span>
                      <span className="truncate block max-w-[200px]" title={asset.value}>{asset.value}</span>
                    </td>
                    <td className="px-6 py-4 capitalize">{asset.environment}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        asset.status?.toLowerCase() === 'active' ? 'bg-green-500/10 text-green-400' :
                        asset.status?.toLowerCase() === 'needs_review' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-slate-500/10 text-slate-400'
                      }`}>
                        {asset.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {asset.ownershipConfirmed ? (
                        <span className="text-green-400 text-xs border border-green-800/50 bg-green-900/20 rounded px-2 py-1">Confirmed</span>
                      ) : (
                        <span className="text-red-400 text-xs border border-red-800/50 bg-red-900/20 rounded px-2 py-1">Unconfirmed</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {asset.lastCheckedAt ? new Date(asset.lastCheckedAt).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/projects/${projectId}/assets/${asset.id}`}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProjectShell>
  );
}
