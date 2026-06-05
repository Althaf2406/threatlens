"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getProjectScans, compareProjectScans, getProjectAssets } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function CompareScansPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [assets, setAssets] = useState<any[]>([]);
  const [beforeScanId, setBeforeScanId] = useState<string>("");
  const [afterScanId, setAfterScanId] = useState<string>("");
  const [comparison, setComparison] = useState<any>(null);
  const [comparing, setComparing] = useState(false);

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
      
      if (scansData.length >= 2) {
        setAfterScanId(scansData[0].id);
        setBeforeScanId(scansData[1].id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load scan history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleCompare = async () => {
    if (!beforeScanId || !afterScanId) return;
    
    try {
      setComparing(true);
      const result = await compareProjectScans(projectId, beforeScanId, afterScanId);
      setComparison(result);
    } catch (err: any) {
      alert("Failed to compare scans: " + err.message);
    } finally {
      setComparing(false);
    }
  };

  if (loading) {
    return (
      <ProjectShell projectId={projectId} title="Compare Scans" subtitle="Loading data...">
        <LoadingState message="Loading scan data..." />
      </ProjectShell>
    );
  }

  if (error || !project) {
    return (
      <ProjectShell projectId={projectId} title="Compare Scans" subtitle="Failed to load">
        <ErrorState message={error || "Project not found"} onRetry={loadData} />
      </ProjectShell>
    );
  }

  if (scans.length < 2) {
    return (
      <ProjectShell projectId={projectId} projectName={project.name} title="Compare Scans" subtitle="Not enough data">
        <div className="mb-6">
          <Link href={`/projects/${projectId}/scans`} className="text-sm text-blue-400 hover:text-blue-300">
            &larr; Back to Scan History
          </Link>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-8 text-center">
          <p className="text-slate-400">At least two scans are required to compare security posture.</p>
          <p className="mt-2 text-sm text-slate-500">Run more passive checks from the project overview.</p>
        </div>
      </ProjectShell>
    );
  }

  const getScanAssetInfo = (scanId: string) => {
    const scan = scans.find(s => s.id === scanId);
    if (!scan) return "";
    const asset = assets.find(a => a.id === scan.assetId);
    return asset ? ` (${asset.name})` : ` (${scan.assetId})`;
  };

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Compare Scans"
      subtitle="Compare two scans to see how the security posture has evolved."
      tokenUsed={project.tokenUsed}
    >
      <div className="mb-6">
        <Link href={`/projects/${projectId}/scans`} className="text-sm text-blue-400 hover:text-blue-300">
          &larr; Back to Scan History
        </Link>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 items-end">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-2">Before Scan</label>
            <select 
              value={beforeScanId} 
              onChange={(e) => setBeforeScanId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              {scans.map(s => (
                <option key={s.id} value={s.id}>{new Date(s.createdAt).toLocaleString()} - {s.id}{getScanAssetInfo(s.id)} (Score: {s.postureScore})</option>
              ))}
            </select>
          </div>
          
          <div className="hidden lg:flex justify-center pb-3">
            <span className="text-slate-500 font-bold">VS</span>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-400 mb-2">After Scan</label>
            <select 
              value={afterScanId} 
              onChange={(e) => setAfterScanId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              {scans.map(s => (
                <option key={s.id} value={s.id}>{new Date(s.createdAt).toLocaleString()} - {s.id}{getScanAssetInfo(s.id)} (Score: {s.postureScore})</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleCompare}
            disabled={comparing || beforeScanId === afterScanId}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {comparing ? "Comparing..." : "Compare"}
          </button>
        </div>
      </div>

      {comparison && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Comparison Results</h3>
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${
              comparison.improvementSummary === 'Improved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              comparison.improvementSummary === 'Regression' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
              'bg-slate-500/10 text-slate-400 border border-slate-500/20'
            }`}>
              {comparison.improvementSummary}
            </span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
             <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-center">
                <p className="text-sm text-slate-400 mb-2">Posture Score</p>
                <div className="flex justify-center items-center gap-4">
                  <span className="text-2xl font-bold text-slate-300">{comparison.beforeScan.postureScore}</span>
                  <span className="text-slate-500">&rarr;</span>
                  <span className="text-2xl font-bold text-white">{comparison.afterScan.postureScore}</span>
                </div>
                <p className={`mt-2 text-sm font-medium ${comparison.postureScoreDelta > 0 ? 'text-green-400' : comparison.postureScoreDelta < 0 ? 'text-red-400' : 'text-slate-500'}`}>
                  {comparison.postureScoreDelta > 0 ? '+' : ''}{comparison.postureScoreDelta} pts
                </p>
             </div>
             
             <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-center">
                <p className="text-sm text-slate-400 mb-2">Total Findings</p>
                <div className="flex justify-center items-center gap-4">
                  <span className="text-2xl font-bold text-slate-300">{comparison.beforeScan.totalFindings}</span>
                  <span className="text-slate-500">&rarr;</span>
                  <span className="text-2xl font-bold text-white">{comparison.afterScan.totalFindings}</span>
                </div>
                <p className={`mt-2 text-sm font-medium ${comparison.totalFindingsDelta < 0 ? 'text-green-400' : comparison.totalFindingsDelta > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                  {comparison.totalFindingsDelta > 0 ? '+' : ''}{comparison.totalFindingsDelta}
                </p>
             </div>
             
             <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 text-center">
                <p className="text-sm text-slate-400 mb-2">High Risk</p>
                <div className="flex justify-center items-center gap-4">
                  <span className="text-2xl font-bold text-slate-300">{comparison.beforeScan.highFindings}</span>
                  <span className="text-slate-500">&rarr;</span>
                  <span className="text-2xl font-bold text-white">{comparison.afterScan.highFindings}</span>
                </div>
                <p className={`mt-2 text-sm font-medium ${comparison.highFindingsDelta < 0 ? 'text-green-400' : comparison.highFindingsDelta > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                  {comparison.highFindingsDelta > 0 ? '+' : ''}{comparison.highFindingsDelta}
                </p>
             </div>
          </div>
          
          <div className="rounded-xl border border-blue-900/50 bg-blue-950/20 p-5">
             <h4 className="text-sm font-medium text-blue-400 mb-2">Remediation Progress</h4>
             <p className="text-white">
               The after scan reports <span className="font-bold text-green-400">{comparison.fixedFindingsCount} fixed findings</span>.
               The security posture {comparison.improvementSummary.toLowerCase()} between these two scans.
             </p>
          </div>
        </div>
      )}
    </ProjectShell>
  );
}
