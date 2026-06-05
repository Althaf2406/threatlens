"use client";

import { use, useState, useEffect } from "react";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getProjectStandards } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
type StandardMapping = {
  id: string;
  framework: string;
  control: string;
  description: string;
  findingId: string;
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
        <strong className="text-orange-400">Note:</strong> Standards mapping is guidance for investigation and remediation, not a formal compliance certification.
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
                <h3 className="text-lg font-semibold text-white">{framework}</h3>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                  {mappings.length} violations
                </span>
              </div>
              <div className="divide-y divide-slate-800/50">
                {mappings.map((mapping) => (
                  <div key={mapping.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-24 shrink-0">
                        <span className="inline-block rounded bg-blue-500/10 px-2 py-1 text-xs font-bold text-blue-400 font-mono">
                          {mapping.control}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-300 mb-2 leading-relaxed">{mapping.description}</p>
                        <p className="text-xs text-slate-500">
                          Related Finding: <span className="text-slate-400 font-medium">{mapping.findingId}</span>
                        </p>
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