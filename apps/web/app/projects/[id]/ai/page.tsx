"use client";

import { use, useState, useEffect } from "react";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getProjectAISummaries, generateProjectAISummary, getProjectFindings } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

export default function AIInvestigationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [generating, setGenerating] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projData, summariesData, findingsData] = await Promise.all([
        getProject(projectId),
        getProjectAISummaries(projectId),
        getProjectFindings(projectId)
      ]);
      
      setProject(projData);
      setSummaries(summariesData);
      setFindings(findingsData);
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        window.location.href = "/login";
        return;
      }
      setError(err.message || "Failed to load AI summaries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleGenerateProjectSummary = async () => {
    try {
      setGenerating(true);
      const newSummary = await generateProjectAISummary(projectId, {
        summary_type: "project"
      });
      setSummaries([...summaries, newSummary]);
    } catch (err: any) {
      alert("Failed to generate project summary: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateFindingSummary = async () => {
    if (!selectedFinding) {
      alert("Please select a finding first");
      return;
    }
    try {
      setGenerating(true);
      const newSummary = await generateProjectAISummary(projectId, {
        summary_type: "finding",
        finding_id: selectedFinding
      });
      setSummaries([...summaries, newSummary]);
    } catch (err: any) {
      alert("Failed to generate finding summary: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <ProjectShell projectId={projectId} projectName="Loading..." title="AI Investigator" subtitle="Loading AI investigation data...">
        <LoadingState message="Loading AI Summaries..." />
      </ProjectShell>
    );
  }

  if (error || !project) {
    return (
      <ProjectShell projectId={projectId} projectName="Error" title="AI Investigator" subtitle="Failed to load">
        <ErrorState message={error || "Project not found"} onRetry={loadData} />
      </ProjectShell>
    );
  }

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="AI Investigator"
      subtitle="AI-driven investigation summaries based on confirmed evidence."
      tokenUsed={project.tokenUsed}
    >
      <div data-tour="ai-investigator-panel" className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 lg:col-span-1">
          <h3 className="text-xl font-semibold text-white mb-4">Generate Project Summary</h3>
          <p className="text-sm text-slate-400 mb-6">
            Generate a high-level summary of the entire project, including all confirmed findings and overall risk posture.
          </p>
          <button 
            onClick={handleGenerateProjectSummary}
            disabled={generating}
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate Project Summary"}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 lg:col-span-2">
          <h3 className="text-xl font-semibold text-white mb-4">Generate Finding Summary</h3>
          <p className="text-sm text-slate-400 mb-6">
            Generate a detailed technical and executive summary for a specific finding.
          </p>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Finding</label>
              <select
                value={selectedFinding}
                onChange={(e) => setSelectedFinding(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none"
              >
                <option value="">-- Choose a finding --</option>
                {findings.map(f => (
                  <option key={f.id} value={f.id}>{f.title} ({f.id})</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleGenerateFindingSummary}
              disabled={generating || !selectedFinding}
              className="rounded-xl bg-slate-700 px-6 py-2 text-sm font-medium text-white transition hover:bg-slate-600 disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-4">Investigation Summaries</h2>
        
        {summaries.length === 0 ? (
          <EmptyState 
            title="No summaries yet" 
            message="Generate a project or finding summary to see AI-driven insights." 
          />
        ) : (
          summaries.slice().reverse().map((summary) => (
            <div key={summary.id} className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
              <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{summary.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">Generated: {new Date(summary.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium border ${
                    summary.claimStatus === 'confirmed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    summary.claimStatus === 'suspected' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                    summary.claimStatus === 'insufficient_evidence' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {summary.claimStatus.replace('_', ' ')}
                  </span>
                  <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300">
                    {summary.summaryType.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Executive Summary</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{summary.executiveSummary}</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">What Happened</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{summary.whatHappened}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Confidence Explanation</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{summary.confidenceExplanation}</p>
                  </div>
                  
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Impact / Blast Radius</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{summary.impactBlastRadius}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Evidence Considered</h4>
                    <ul className="list-disc pl-5 text-sm text-slate-400 space-y-1">
                      {JSON.parse(summary.evidenceConsideredJson || '[]').map((ev: any, i: number) => (
                        <li key={i}>{ev.type}: {ev.details}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Recommended Remediation</h4>
                    <ul className="list-disc pl-5 text-sm text-slate-400 space-y-1">
                      {JSON.parse(summary.recommendedRemediationJson || '[]').map((rem: any, i: number) => (
                        <li key={i}>{rem.action}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Unknowns and Limitations</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{summary.unknownsAndLimitations}</p>
                  </div>
                  
                  <div className="bg-blue-900/10 rounded-xl p-4 border border-blue-900/30">
                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">Safety Boundary</h4>
                    <p className="text-sm text-blue-300/70 leading-relaxed">{summary.safetyBoundary}</p>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </ProjectShell>
  );
}
