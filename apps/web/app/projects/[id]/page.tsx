"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { ProjectShell } from "@/components/ProjectShell";
import {
  getProject,
  getProjectAssets,
  getProjectFindings,
  runPassiveCheck
} from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [allFindings, setAllFindings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showSimulatedAlert, setShowSimulatedAlert] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projData, assetsData, findingsData] = await Promise.all([
        getProject(projectId),
        getProjectAssets(projectId),
        getProjectFindings(projectId)
      ]);
      
      setProject(projData);
      setAssets(assetsData);
      setAllFindings(findingsData);
    } catch (err: any) {
      setError(err.message || "Failed to load project details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  if (loading) {
    return (
      <ProjectShell projectId={projectId} projectName="Loading..." title="Overview" subtitle="Loading project data...">
        <LoadingState message="Loading project overview..." />
      </ProjectShell>
    );
  }

  if (error || !project) {
    return (
      <ProjectShell projectId={projectId} projectName="Error" title="Overview" subtitle="Failed to load">
        <ErrorState message={error || "Project not found"} onRetry={loadData} />
      </ProjectShell>
    );
  }
  
  const highRiskCount = allFindings.filter(f => f.severity === 'High' || f.severity === 'Critical').length;
  const recentFindings = [...allFindings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const handlePassiveCheck = async () => {
    if (assets.length === 0) {
      alert("Add an asset before running passive check.");
      return;
    }
    
    try {
      setIsScanning(true);
      const assetId = assets[0].id; // ambil asset pertama sesuai requirement
      await runPassiveCheck(projectId, assetId);
      
      setShowSimulatedAlert(true);
      setTimeout(() => setShowSimulatedAlert(false), 3000);
      
      // Refresh findings
      const findingsData = await getProjectFindings(projectId);
      setAllFindings(findingsData);
    } catch (err) {
      console.error("Passive check failed", err);
      alert("Failed to run passive check.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Overview"
      subtitle="Project detail, monitored assets, latest findings, and passive scan actions."
      tokenUsed={project.tokenUsed}
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="mt-3 text-xl font-semibold text-white">
            Project Overview
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Environment: {project.environment} | Last scan: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'} | Risk level: {project.riskLevel || 'Low'}
          </p>
        </div>

        <Link
          href={`/projects/${projectId}/assets`}
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 text-center"
        >
          Run Check from Assets Page
        </Link>
      </div>
      
      {showSimulatedAlert && (
        <div className="mb-6 rounded-xl border border-green-800 bg-green-900/30 p-4 text-green-300">
          Passive check completed. Latest scan result updated.
        </div>
      )}

      <div data-tour="project-overview-summary" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Posture Score</p>
          <p className="mt-3 text-3xl font-bold text-white">{project.postureScore || 0}</p>
          <p className="mt-2 text-sm text-slate-500">
            Current security posture
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Open Findings</p>
          <p className="mt-3 text-3xl font-bold text-white">{allFindings.length}</p>
          <p className="mt-2 text-sm text-slate-500">
            Need review or remediation
          </p>
        </div>
        
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">High Risk</p>
          <p className="mt-3 text-3xl font-bold text-white">{highRiskCount}</p>
          <p className="mt-2 text-sm text-slate-500">
            High severity issues
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Assets</p>
          <p className="mt-3 text-3xl font-bold text-white">{assets.length}</p>
          <p className="mt-2 text-sm text-slate-500">
            Monitored project assets
          </p>
        </div>
      </div>
      
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Security Improvement</h3>
          <p className="mt-1 text-sm text-slate-400">Track how your posture score is trending over time.</p>
        </div>
        <Link href={`/projects/${projectId}/scans`} className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 whitespace-nowrap">
          View Scan History &rarr;
        </Link>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Assets</h3>

            <div className="flex gap-2">
              <Link href={`/projects/${projectId}/assets`} className="text-sm text-blue-400 hover:text-blue-300">
                View all
              </Link>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {assets.length === 0 ? (
              <p className="text-sm text-slate-500">No assets configured.</p>
            ) : (
              assets.slice(0, 3).map((asset) => (
                <Link
                  key={asset.id}
                  href={`/projects/${projectId}/assets/${asset.id}`}
                  className="block rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-white">{asset.name}</h4>
                      <p className="mt-1 text-sm text-slate-500">{asset.type}</p>
                      <p className="mt-2 text-xs text-slate-600 truncate max-w-[200px]">
                        {asset.value}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-300">
                      {asset.status || 'Active'}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Latest Findings
            </h3>

            <Link
              href={`/projects/${projectId}/findings`}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recentFindings.length === 0 ? (
               <p className="text-sm text-slate-500">No recent findings.</p>
            ) : (
              recentFindings.map((finding) => (
                <Link
                  href={`/projects/${projectId}/findings/${finding.id}`}
                  key={finding.id}
                  className="block rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:bg-slate-900"
                >
                  <h4 className="font-medium text-white">{finding.title}</h4>

                  <div className="mt-3 flex gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      finding.severity === 'High' ? 'bg-red-500/10 text-red-300' : 
                      finding.severity === 'Medium' ? 'bg-orange-500/10 text-orange-300' : 
                      'bg-blue-500/10 text-blue-300'
                    }`}>
                      {finding.severity}
                    </span>

                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                      {finding.confidence}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </ProjectShell>
  );
}