"use client";

import { use } from "react";
import Link from "next/link";
import { ProjectShell } from "@/components/ProjectShell";
import { getProjectById, getGraphNodesByProjectId, getGraphEdgesByProjectId } from "@/lib/mock-data";

export default function GraphPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const project = getProjectById(projectId);
  const nodes = getGraphNodesByProjectId(projectId);
  const edges = getGraphEdgesByProjectId(projectId);

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

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Attack Graph"
      subtitle="Visual representation of relationships between assets, users, and findings."
      tokenUsed={project.tokenUsed}
    >
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex items-center justify-center min-h-[400px]">
          {nodes.length === 0 ? (
            <div className="text-center">
              <p className="text-sm text-slate-500 bg-slate-950 px-4 py-1 inline-block rounded-full border border-slate-800">No graph data available.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-8 justify-center items-center">
              {/* Dummy visual representation of graph */}
              {nodes.map(node => (
                <div key={node.id} className="relative group">
                  <div className={`flex flex-col items-center justify-center w-28 h-28 rounded-full border-2 bg-slate-950 shadow-lg transition-transform group-hover:scale-105 ${
                    node.risk === 'High' ? 'border-red-500/50 shadow-red-500/20' :
                    node.risk === 'Medium' ? 'border-orange-500/50 shadow-orange-500/20' :
                    'border-blue-500/50 shadow-blue-500/20'
                  }`}>
                    <span className="text-xs font-mono text-slate-400 uppercase">{node.type}</span>
                    <span className="text-sm font-semibold text-white mt-1 text-center px-2 truncate max-w-full">{node.label}</span>
                  </div>
                  
                  {/* Edges representation */}
                  {edges.filter(e => e.from === node.id).map(edge => {
                    const toNode = nodes.find(n => n.id === edge.to);
                    return (
                      <div key={edge.id} className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max hidden group-hover:block z-20">
                        <div className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full shadow border border-slate-700">
                          &rarr; {edge.relation} &rarr; {toNode?.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold text-white">Graph Edges</h3>
            <div className="mt-4 space-y-3">
              {edges.length === 0 ? (
                <p className="text-sm text-slate-500">No relationships found.</p>
              ) : (
                edges.map(edge => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  return (
                    <div key={edge.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm">
                      <span className="text-blue-400">{fromNode?.label}</span>
                      <span className="text-slate-500 mx-2">{edge.relation}</span>
                      <span className="text-orange-400">{toNode?.label}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h3 className="text-lg font-semibold text-white">Graph Nodes</h3>
            <div className="mt-4 space-y-3">
              {nodes.map(node => (
                <div key={node.id} className="flex justify-between items-center bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-300">{node.label}</p>
                    <p className="text-xs text-slate-500 uppercase">{node.type}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    node.risk === 'High' ? 'bg-red-500/10 text-red-400' :
                    node.risk === 'Medium' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {node.risk} Risk
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProjectShell>
  );
}