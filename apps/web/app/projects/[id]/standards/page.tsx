"use client";

import { use } from "react";
import Link from "next/link";
import { ProjectShell } from "@/components/ProjectShell";
import { getProjectById, getFindingsByProjectId, getStandardMappingsByFindingId } from "@/lib/mock-data";

export default function StandardsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const project = getProjectById(projectId);
  const findings = getFindingsByProjectId(projectId);
  
  // Aggregate all standards across all findings
  const frameworkMap = new Map<string, {
    passed: number,
    failed: number,
    total: number,
    controls: Map<string, {
      description: string,
      status: string,
      findingIds: string[]
    }>
  }>();

  // Initialize with some mock data structure so it's not empty if no findings map to standards
  const defaultFrameworks = ["OWASP Top 10", "CIS Benchmarks", "NIST CSF"];
  defaultFrameworks.forEach(fw => {
    frameworkMap.set(fw, {
      passed: Math.floor(Math.random() * 50) + 10, // Mock passed controls
      failed: 0,
      total: 0, // Will be updated later
      controls: new Map()
    });
  });

  // Map real findings to standards
  findings.forEach(finding => {
    const standards = getStandardMappingsByFindingId(finding.id);
    standards.forEach(std => {
      if (!frameworkMap.has(std.framework)) {
        frameworkMap.set(std.framework, { passed: 20, failed: 0, total: 0, controls: new Map() });
      }
      
      const fwData = frameworkMap.get(std.framework)!;
      fwData.failed += 1;
      
      if (!fwData.controls.has(std.control)) {
        fwData.controls.set(std.control, {
          description: std.description,
          status: "failed",
          findingIds: [finding.id]
        });
      } else {
        fwData.controls.get(std.control)!.findingIds.push(finding.id);
      }
    });
  });

  // Calculate totals
  frameworkMap.forEach(fw => {
    fw.total = fw.passed + fw.failed;
  });

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
      title="Compliance Standards"
      subtitle="Map security findings to industry compliance frameworks."
      tokenUsed={project.tokenUsed}
    >
      <div className="space-y-8">
        {Array.from(frameworkMap.entries()).map(([framework, data]) => {
          const score = Math.round((data.passed / data.total) * 100);
          
          return (
            <div key={framework} className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{framework}</h2>
                  <p className="text-sm text-slate-400 mt-1">Compliance overview and control failures.</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Score</p>
                    <p className={`text-2xl font-bold ${
                      score >= 80 ? 'text-green-400' : 
                      score >= 60 ? 'text-orange-400' : 'text-red-400'
                    }`}>{score}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Failed</p>
                    <p className="text-2xl font-bold text-red-400">{data.failed}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Passed</p>
                    <p className="text-2xl font-bold text-green-400">{data.passed}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-sm font-medium text-slate-300 mb-4 uppercase tracking-wider">Failed Controls</h3>
                
                {data.controls.size === 0 ? (
                  <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center text-green-400 text-sm">
                    All evaluated controls passed. No findings mapped to this framework.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Array.from(data.controls.entries()).map(([control, controlData]) => (
                      <div key={control} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="rounded bg-red-500/10 px-2 py-1 text-xs font-mono font-medium text-red-400">
                            {control}
                          </span>
                          <span className="text-sm text-slate-300 font-medium">{controlData.description}</span>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap gap-2">
                          <span className="text-xs text-slate-500 flex items-center">Associated findings:</span>
                          {controlData.findingIds.map(fid => {
                            const f = findings.find(f => f.id === fid);
                            return (
                              <Link key={fid} href={`/projects/${projectId}/findings/${fid}`} className="text-xs bg-slate-900 border border-slate-700 px-2 py-1 rounded hover:bg-slate-800 hover:text-blue-400 transition text-slate-300">
                                {f?.title || fid}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ProjectShell>
  );
}