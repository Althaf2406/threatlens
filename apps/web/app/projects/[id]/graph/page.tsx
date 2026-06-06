"use client";

import { use, useState, useEffect } from "react";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getProjectGraph } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

export default function GraphPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [graphData, setGraphData] = useState<{nodes: any[], edges: any[]}>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projData, gData] = await Promise.all([
        getProject(projectId),
        getProjectGraph(projectId)
      ]);
      
      setProject(projData);
      setGraphData(gData);
    } catch (err: any) {
      setError(err.message || "Failed to load graph data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  if (loading) {
    return (
      <ProjectShell projectId={projectId} projectName="Loading..." title="Attack Graph" subtitle="Loading relationships...">
        <LoadingState message="Mapping entity relationships..." />
      </ProjectShell>
    );
  }

  if (error || !project) {
    return (
      <ProjectShell projectId={projectId} projectName="Error" title="Attack Graph" subtitle="Failed to load">
        <ErrorState message={error || "Project not found"} onRetry={loadData} />
      </ProjectShell>
    );
  }

  const { nodes = [], edges = [] } = graphData;

  const getNodeIcon = (type: string) => {
    switch(type) {
      case 'user': return '👤';
      case 'ip_address': return '🌐';
      case 'session': return '🔑';
      case 'asset': return '🖥️';
      case 'event': return '⚡';
      case 'finding': return '⚠️';
      default: return '📦';
    }
  };

  const getEdgeLabel = (type: string) => {
    if (!type) return 'Unknown';
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Attack Graph"
      subtitle="Visual representation of relationships between assets, identities, and findings."
      tokenUsed={project.tokenUsed}
    >
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="text-lg font-semibold text-white">Relationship Explorer</h3>
        <p className="mt-2 text-sm text-slate-400">
          We use node-edge mapping to show how elements interact. This helps identify lateral movement paths and identity boundaries.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Nodes List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h4 className="font-semibold text-white mb-4">Discovered Nodes ({nodes.length})</h4>
          {nodes.length === 0 ? (
            <EmptyState title="No nodes" message="No entity nodes mapped yet." />
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {nodes.map(node => (
                <div key={node.id} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xl">
                    {getNodeIcon(node.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{node.label}</p>
                    <p className="text-xs text-slate-500">{node.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edges List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h4 className="font-semibold text-white mb-4">Relationships ({edges.length})</h4>
          {edges.length === 0 ? (
            <EmptyState title="No edges" message="No relationships mapped yet." />
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {edges.map(edge => {
                const sourceNode = nodes.find(n => n.id === edge.sourceId);
                const targetNode = nodes.find(n => n.id === edge.targetId);
                return (
                  <div key={edge.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col gap-1 w-1/3">
                        <span className="text-xs text-slate-500">Source</span>
                        <span className="text-sm font-medium text-slate-300 truncate" title={sourceNode?.label}>
                          {sourceNode?.label || edge.sourceId}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center w-1/3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1 text-center">
                          {getEdgeLabel(edge.type)}
                        </span>
                        <div className="h-px w-full bg-slate-700 relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 border-t border-r border-slate-700 transform rotate-45"></div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 w-1/3 items-end">
                        <span className="text-xs text-slate-500">Target</span>
                        <span className="text-sm font-medium text-slate-300 truncate" title={targetNode?.label}>
                          {targetNode?.label || edge.targetId}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </ProjectShell>
  );
}