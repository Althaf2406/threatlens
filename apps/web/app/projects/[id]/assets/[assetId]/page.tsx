"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getProjectAsset, deleteProjectAsset, runPassiveCheck, confirmProjectAssetOwnership } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function AssetDetailPage({ params }: { params: Promise<{ id: string, assetId: string }> }) {
  const { id: projectId, assetId } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSimulatedAlert, setShowSimulatedAlert] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projData, assetData] = await Promise.all([
        getProject(projectId),
        getProjectAsset(projectId, assetId)
      ]);
      setProject(projData);
      setAsset(assetData);
    } catch (err: any) {
      setError(err.message || "Failed to load asset details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId, assetId]);

  const handlePassiveCheck = async () => {
    if (!asset.ownershipConfirmed) {
      alert("You must confirm ownership before running a passive check.");
      return;
    }
    
    try {
      setIsScanning(true);
      await runPassiveCheck(projectId, assetId);
      
      setShowSimulatedAlert(true);
      setTimeout(() => setShowSimulatedAlert(false), 3000);
      
      // Refresh asset to get updated lastCheckedAt
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to run passive check.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmOwnership = async () => {
    try {
      setIsConfirming(true);
      await confirmProjectAssetOwnership(projectId, assetId);
      await loadData();
    } catch (err: any) {
      alert(err.message || "Failed to confirm ownership.");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this asset? This action cannot be undone.")) {
      try {
        setIsDeleting(true);
        await deleteProjectAsset(projectId, assetId);
        router.push(`/projects/${projectId}/assets`);
      } catch (err: any) {
        alert(err.message || "Failed to delete asset.");
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <ProjectShell projectId={projectId} projectName="Loading..." title="Asset Details">
        <LoadingState message="Loading asset details..." />
      </ProjectShell>
    );
  }

  if (error || !project || !asset) {
    return (
      <ProjectShell projectId={projectId} projectName="Error" title="Asset Details">
        <ErrorState message={error || "Failed to load asset"} onRetry={loadData} />
      </ProjectShell>
    );
  }

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title={asset.name}
      subtitle={`Type: ${asset.type} | Environment: ${asset.environment}`}
    >
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Link
            href={`/projects/${projectId}/assets`}
            className="text-sm text-slate-400 hover:text-white"
          >
            &larr; Back to Assets
          </Link>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/projects/${projectId}/assets/${assetId}/edit`}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700"
          >
            Edit Asset
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/50"
          >
            {isDeleting ? "Deleting..." : "Delete Asset"}
          </button>
        </div>
      </div>

      {showSimulatedAlert && (
        <div className="mb-6 rounded-xl border border-green-800 bg-green-900/30 p-4 text-green-300">
          Passive check completed successfully. Check the Scans section for results.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Asset Information</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-slate-500">Value / Target</dt>
                <dd className="mt-1 text-sm text-white break-all">{asset.value}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Status</dt>
                <dd className="mt-1 text-sm text-white capitalize">{asset.status}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-slate-500">Description</dt>
                <dd className="mt-1 text-sm text-white whitespace-pre-wrap">{asset.description || "No description provided."}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-slate-500">Tags</dt>
                <dd className="mt-1 text-sm text-white">
                  {asset.tagsJson ? (
                    <div className="flex gap-2 flex-wrap">
                      {asset.tagsJson.split(',').map((t: string) => t.trim()).filter((t: string) => t).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300">{tag}</span>
                      ))}
                    </div>
                  ) : "None"}
                </dd>
              </div>
            </dl>
          </div>
          
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Workflow & Actions</h3>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950">
                <div>
                  <h4 className="font-medium text-white">Ownership Status</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    {asset.ownershipConfirmed 
                      ? "Confirmed. This asset is cleared for defensive scanning."
                      : "Unconfirmed. You must confirm ownership before scanning."}
                  </p>
                </div>
                {!asset.ownershipConfirmed ? (
                  <button
                    onClick={handleConfirmOwnership}
                    disabled={isConfirming}
                    className="shrink-0 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                  >
                    {isConfirming ? "Confirming..." : "Confirm Ownership"}
                  </button>
                ) : (
                  <span className="shrink-0 inline-flex items-center text-green-400 text-sm font-medium">
                    &check; Confirmed
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950">
                <div>
                  <h4 className="font-medium text-white">Passive Security Check</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Run a non-intrusive scan to identify misconfigurations and public exposure.
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Last checked: {asset.lastCheckedAt ? new Date(asset.lastCheckedAt).toLocaleString() : 'Never'}
                  </p>
                </div>
                <button
                  onClick={handlePassiveCheck}
                  disabled={isScanning || !asset.ownershipConfirmed}
                  className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-tour="run-passive-check"
                >
                  {isScanning ? "Scanning..." : "Run Passive Check"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Related Scans</h3>
            <p className="text-sm text-slate-400 mb-4">View scan history specifically for this asset.</p>
            <Link
              href={`/projects/${projectId}/scans`}
              className="block text-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              View Scans
            </Link>
          </div>
          
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
            <div className="text-sm text-slate-300 whitespace-pre-wrap">
              {asset.notes || "No internal notes for this asset."}
            </div>
          </div>
        </div>
      </div>
    </ProjectShell>
  );
}
