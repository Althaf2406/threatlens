"use client";

import { use, useState, useEffect } from "react";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getProjectStandards } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

type StandardMapping = {
  id: string;
  framework: string;
  standardVersion: string | null;
  controlId: string;
  description: string;
  findingId: string;
  findingTitle: string;
  findingSeverity: string;
  mappingReason: string | null;
};

export default function StandardsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [standards, setStandards] = useState<StandardMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projData, standardsData] = await Promise.all([
        getProject(projectId),
        getProjectStandards(projectId)
      ]);
      
      setProject(projData);
      setStandards(standardsData);
    } catch (err: any) {
      setError(err.message || "Failed to load standards mapping.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  if (loading) {
    return (
      <ProjectShell projectId={projectId} projectName="Loading..." title="Standards Mapping" subtitle="Loading compliance data...">
        <LoadingState message="Loading standards mapping..." />
      </ProjectShell>
    );
  }

  if (error || !project) {
    return (
      <ProjectShell projectId={projectId} projectName="Error" title="Standards Mapping" subtitle="Failed to load">
        <ErrorState message={error || "Project not found"} onRetry={loadData} />
      </ProjectShell>
    );
  }

  // Group standards by framework
  const groupedStandards = standards.reduce<Record<string, StandardMapping[]>>((acc, curr) => {
    if (!acc[curr.framework]) {
      acc[curr.framework] = [];
    }
    acc[curr.framework].push(curr);
    return acc;
  }, {});

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Standards Mapping"
      subtitle="Map current findings against common security frameworks."
      tokenUsed={project.tokenUsed}
    >
      <div className="mb-8 rounded-2xl border border-orange-900/50 bg-orange-900/10 p-4 text-orange-200 text-sm">
        <strong className="text-orange-400">Note:</strong> This mapping is guidance for remediation and investigation, not a formal compliance certification.
      </div>

      <div className="space-y-8">
        {Object.keys(groupedStandards).length === 0 ? (
          <EmptyState 
            title="No mappings found" 
            message="There are no findings in this project that map to known security standards yet." 
          />
        ) : (
          Object.entries(groupedStandards).map(([framework, mappings]) => (
            <div key={framework} className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  {framework} <span className="text-slate-400 text-sm font-normal ml-2">v{mappings[0]?.standardVersion || "Unknown"}</span>
                </h3>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                  {mappings.length} findings
                </span>
              </div>
              <div className="divide-y divide-slate-800/50">
                {mappings.map((mapping) => (
                  <div key={mapping.id} className="p-6">
                    <div className="flex items-start gap-4 flex-col md:flex-row">
                      <div className="w-full md:w-32 shrink-0">
                        <span className="inline-block rounded bg-blue-500/10 px-2 py-1 text-sm font-bold text-blue-400 font-mono">
                          {mapping.controlId}
                        </span>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h4 className="text-base font-medium text-white">{mapping.description}</h4>
                          {mapping.mappingReason && (
                            <p className="text-sm text-slate-400 mt-1 italic">"{mapping.mappingReason}"</p>
                          )}
                        </div>
                        
                        <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 inline-block w-full">
                          <p className="text-xs text-slate-500 mb-1">Related Finding:</p>
                          <Link href={`/projects/${projectId}/findings/${mapping.findingId}`} className="group flex items-center gap-2">
                            <span className="font-medium text-slate-300 group-hover:text-blue-400 transition">
                              {mapping.findingTitle}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              mapping.findingSeverity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                              mapping.findingSeverity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                              mapping.findingSeverity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-slate-500/20 text-slate-400'
                            }`}>
                              {mapping.findingSeverity}
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </ProjectShell>
  );
}