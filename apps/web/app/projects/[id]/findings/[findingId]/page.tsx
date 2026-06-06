"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getFindingDetail, getProjectAISummaries, getUsageSettings, generateProjectAISummary } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function FindingDetailPage({
  params,
}: {
  params: Promise<{ id: string; findingId: string }>;
}) {
  const { id: projectId, findingId } = use(params);

  const [project, setProject] = useState<any>(null);
  const [finding, setFinding] = useState<any>(null);
  const [aiSummaries, setAiSummaries] = useState<any[]>([]);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCostPreview, setShowCostPreview] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projData, findingData, summariesData, usageData] = await Promise.all([
        getProject(projectId),
        getFindingDetail(projectId, findingId),
        getProjectAISummaries(projectId),
        getUsageSettings()
      ]);
      
      setProject(projData);
      setFinding(findingData);
      const findingSummaries = summariesData.filter((s: any) => s.findingId === findingId);
      setAiSummaries(findingSummaries.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setUsage(usageData);
    } catch (err: any) {
      setError(err.message || "Failed to load finding details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId, findingId]);

  const handleGenerateClick = () => {
    setShowCostPreview(true);
  };

  const handleGenerate = async () => {
    try {
      setShowCostPreview(false);
      setIsGenerating(true);
      
      await generateProjectAISummary(projectId, {
        finding_id: findingId,
        summary_type: "Technical Context"
      });
      
      const [summariesData, usageData] = await Promise.all([
        getProjectAISummaries(projectId),
        getUsageSettings()
      ]);
      const findingSummaries = summariesData.filter((s: any) => s.findingId === findingId);
      setAiSummaries(findingSummaries.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setUsage(usageData);
    } catch (err: any) {
      alert("Failed to generate AI summary: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <ProjectShell projectId={projectId} projectName="Loading..." title="Finding Detail" subtitle="Loading finding data...">
        <LoadingState message="Loading finding details..." />
      </ProjectShell>
    );
  }

  if (error || !project || !finding) {
    return (
      <ProjectShell projectId={projectId} projectName="Error" title="Finding Detail" subtitle="Failed to load">
        <ErrorState message={error || "Finding not found"} onRetry={loadData} />
      </ProjectShell>
    );
  }

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Finding Detail"
      subtitle="Detailed analysis, evidence, and remediation steps."
      tokenUsed={project.tokenUsed}
    >
      {showCostPreview && usage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Cost Preview</h3>
            <p className="text-sm text-slate-400 mb-6">Generating an AI Summary consumes tokens.</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-sm font-medium text-slate-400">AI Mode</span>
                <span className="text-sm font-bold text-blue-400">{usage.aiMode}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-sm font-medium text-slate-400">Tokens Required</span>
                <span className="text-sm font-bold text-yellow-400">100</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-sm font-medium text-slate-400">Remaining Tokens Before</span>
                <span className="text-sm font-bold text-slate-200">{usage.tokenLimit - usage.tokenUsed}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-sm font-medium text-slate-400">Remaining Tokens After</span>
                <span className={`text-sm font-bold ${usage.tokenLimit - usage.tokenUsed - 100 < 0 ? 'text-red-500' : 'text-green-400'}`}>
                  {usage.tokenLimit - usage.tokenUsed - 100}
                </span>
              </div>
            </div>

            {usage.tokenLimit - usage.tokenUsed - 100 < 0 && (
              <p className="text-xs text-red-400 mb-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                Not enough tokens. You need to upgrade your plan or reduce usage.
              </p>
            )}
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCostPreview(false)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleGenerate}
                disabled={usage.tokenLimit - usage.tokenUsed - 100 < 0}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
              >
                Confirm & Generate
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <Link
          href={`/projects/${projectId}/findings`}
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-blue-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Findings
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{finding.title}</h2>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                {finding.category}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Affected Asset: <Link href={`/projects/${projectId}/assets/${finding.assetId}`} className="font-medium text-blue-400 hover:text-blue-300">
                {finding.assetId}
              </Link>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${
              finding.severity === 'High' || finding.severity === 'Critical' ? 'bg-red-500/10 text-red-300 border border-red-500/20' : 
              finding.severity === 'Medium' ? 'bg-orange-500/10 text-orange-300 border border-orange-500/20' : 
              'bg-blue-500/10 text-blue-300 border border-blue-500/20'
            }`}>
              {finding.severity} Severity
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm font-medium text-slate-300">
              {finding.status}
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Confidence Score</p>
            <p className="mt-1 text-lg font-semibold text-white">{finding.confidence}</p>
          </div>
          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Blast Radius</p>
            <p className="mt-1 text-lg font-semibold text-white">{finding.blastRadius}</p>
          </div>
          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Detected On</p>
            <p className="mt-1 text-lg font-semibold text-white">{new Date(finding.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white">Description</h3>
          <p className="mt-3 text-slate-300 leading-relaxed">
            {finding.description}
          </p>
        </div>

        {/* AI Summary Section */}
        <div className="mt-10 rounded-xl border border-purple-900/50 bg-purple-900/10 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">AI Investigation Summary</h3>
              <p className="text-sm text-slate-400">Generate an AI summary for this specific finding.</p>
            </div>
            <button 
              onClick={handleGenerateClick}
              disabled={isGenerating}
              className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500 disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate AI Summary"}
            </button>
          </div>
          
          {aiSummaries.length > 0 ? (
            <div className="space-y-4">
              {aiSummaries.map((summary) => (
                <div key={summary.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold text-white">Generated: {new Date(summary.createdAt).toLocaleString()}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      summary.claimStatus === 'evidence_backed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {summary.claimStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-slate-300 space-y-4">
                    <div>
                      <strong className="text-slate-400">Executive Summary:</strong>
                      <p className="mt-1">{summary.executiveSummary}</p>
                    </div>
                    <div>
                      <strong className="text-slate-400">Technical Context:</strong>
                      <p className="mt-1 whitespace-pre-wrap">{summary.technicalContext}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 mt-4">No AI summaries generated for this finding yet.</p>
          )}
        </div>

        {finding.ruleKey && (
          <div className="mt-8 rounded-xl border border-blue-900/50 bg-blue-900/10 p-5">
            <h3 className="text-lg font-semibold text-white mb-2">Detection Context</h3>
            <p className="text-sm text-slate-300 mb-3">
              This finding was generated by the automated engine based on a pre-configured defensive rule.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500">Rule Key</span>
                <p className="font-mono text-sm text-blue-400 mt-1">{finding.ruleKey}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Rule ID</span>
                <p className="font-mono text-sm text-blue-400 mt-1">{finding.ruleId}</p>
              </div>
            </div>
          </div>
        )}

        {/* Standards Mapping Section */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-white">Standards Mapping</h3>
          <div className="mt-4">
            {finding.standards && finding.standards.length > 0 ? (
              <div className="space-y-4">
                {finding.standards.map((mapping: any) => (
                  <div key={mapping.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded">
                        {mapping.controlId}
                      </span>
                      <h4 className="font-medium text-white">{mapping.framework} {mapping.standardVersion}</h4>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{mapping.description}</p>
                    {mapping.mappingReason && (
                      <p className="text-xs text-slate-500 italic">Reason: {mapping.mappingReason}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No standard mapping is available for this finding.</p>
            )}
          </div>
        </div>

        {/* Evidence Section */}
        <div data-tour="evidence-section" className="mt-10">
          <h3 className="text-lg font-semibold text-white">Evidence & Telemetry</h3>
          <div className="mt-4 space-y-4">
            {(finding.evidence || finding.evidenceIds || []).length === 0 ? (
              <p className="text-sm text-slate-500">No evidence recorded.</p>
            ) : (
              (finding.evidence || finding.evidenceIds || []).map((ev: any, idx: number) => (
                <div key={ev.id || idx} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-blue-400">
                      {ev.source || ev.type || 'Log'}
                    </span>
                    <span className="text-xs text-slate-500">{new Date(ev.timestamp || finding.createdAt).toLocaleString()}</span>
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-300">
                    <code>
                      {(() => {
                        const content = ev.detail !== undefined ? ev.detail : (ev.data !== undefined ? ev.data : ev);
                        if (typeof content === 'string') {
                          try {
                            return JSON.stringify(JSON.parse(content), null, 2);
                          } catch {
                            return content;
                          }
                        }
                        return JSON.stringify(content, null, 2);
                      })()}
                    </code>
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Remediation Section */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-white">Remediation Checklist</h3>
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-5">
            <ul className="space-y-3">
              {(finding.remediationTasks || finding.remediationTaskIds || []).length === 0 ? (
                <li className="text-sm text-slate-500">No remediation tasks defined.</li>
              ) : (
                (finding.remediationTasks || finding.remediationTaskIds || []).map((task: any, idx: number) => (
                  <li key={task.id || idx} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-700 bg-slate-900 text-transparent">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-300">{typeof task === 'string' ? task : task.title || JSON.stringify(task)}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </ProjectShell>
  );
}
