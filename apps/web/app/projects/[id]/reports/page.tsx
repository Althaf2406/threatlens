"use client";

import { use, useState, useEffect } from "react";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getProjectReports, generateProjectReport } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

export default function ReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedReportType, setSelectedReportType] = useState("Executive Summary");
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projData, reportsData] = await Promise.all([
        getProject(projectId),
        getProjectReports(projectId)
      ]);
      
      setProject(projData);
      setReports(reportsData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err: any) {
      setError(err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setSuccessMessage("");
      await generateProjectReport(projectId, selectedReportType);
      
      setSuccessMessage("Report generated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
      
      const reportsData = await getProjectReports(projectId);
      setReports(reportsData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error(err);
      alert("Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <ProjectShell projectId={projectId} projectName="Loading..." title="Reporting" subtitle="Loading reports...">
        <LoadingState message="Loading generated reports..." />
      </ProjectShell>
    );
  }

  if (error || !project) {
    return (
      <ProjectShell projectId={projectId} projectName="Error" title="Reporting" subtitle="Failed to load">
        <ErrorState message={error || "Project not found"} onRetry={loadData} />
      </ProjectShell>
    );
  }

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Reporting"
      subtitle="Generate and view evidence-backed security reports."
      tokenUsed={project.tokenUsed}
    >
      <div className="mb-6 rounded-xl border border-blue-900/50 bg-blue-900/10 p-4 text-blue-200 text-sm">
        <strong className="text-blue-400">Note:</strong> All claims in the report must be evidence-backed. Unknown or insufficient evidence must be stated explicitly.
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Generator Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 xl:col-span-1 h-fit">
          <h3 className="text-lg font-semibold text-white">Generate Report</h3>
          <p className="mt-2 text-sm text-slate-400">
            Create a new point-in-time snapshot of the project's security posture.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Report Type</label>
              <select 
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 focus:border-blue-500 focus:outline-none"
              >
                <option value="Executive Summary">Executive Summary</option>
                <option value="Technical Report">Technical Report</option>
              </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate Report"}
            </button>
            
            {successMessage && (
              <p className="text-sm text-green-400 mt-2 text-center">{successMessage}</p>
            )}
          </div>
        </div>

        {/* Reports List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 xl:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-6">Generated Reports</h3>

          <div className="space-y-4">
            {reports.length === 0 ? (
               <EmptyState 
                title="No reports generated" 
                message="Generate your first report using the form to the left." 
               />
            ) : (
              reports.map((report) => (
                <div key={report.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5 overflow-hidden">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-3 mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{report.title}</h4>
                      <span className="text-xs font-medium text-slate-400">Type: {report.type}</span>
                    </div>
                    <span className="text-xs text-slate-500">{new Date(report.createdAt).toLocaleString()}</span>
                  </div>
                  
                  <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {report.summary}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProjectShell>
  );
}