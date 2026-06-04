"use client";

import Link from "next/link";
import { use, useState } from "react";
import { ProjectShell } from "@/components/ProjectShell";
import {
  getProjectById,
  getAssetsByProjectId,
  getFindingsByProjectId,
} from "@/lib/mock-data";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const [showSimulatedAlert, setShowSimulatedAlert] = useState(false);

  const project = getProjectById(projectId);
  const assets = getAssetsByProjectId(projectId);
  const allFindings = getFindingsByProjectId(projectId);
  
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
  
  const highRiskCount = allFindings.filter(f => f.severity === 'High' || f.severity === 'Critical').length;
  const recentFindings = [...allFindings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  const handlePassiveCheck = () => {
    setShowSimulatedAlert(true);
    setTimeout(() => setShowSimulatedAlert(false), 3000);
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
            Environment: {project.environment} | Last scan: {project.updatedAt} | Risk level: {project.riskLevel}
          </p>
        </div>

        <button 
          onClick={handlePassiveCheck}
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Run Passive Check
        </button>
      </div>
      
      {showSimulatedAlert && (
        <div className="mb-6 rounded-xl border border-green-800 bg-green-900/30 p-4 text-green-300">
          Passive check simulated. Latest scan result updated.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">Posture Score</p>
          <p className="mt-3 text-3xl font-bold text-white">{project.postureScore}</p>
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

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Assets</h3>

            <button className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800">
              Add Asset
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {assets.length === 0 ? (
              <p className="text-sm text-slate-500">No assets configured.</p>
            ) : (
              assets.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-white">{asset.name}</h4>
                      <p className="mt-1 text-sm text-slate-500">{asset.type}</p>
                      <p className="mt-2 text-xs text-slate-600">
                        {asset.value}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-300">
                      {asset.status}
                    </span>
                  </div>
                </div>
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