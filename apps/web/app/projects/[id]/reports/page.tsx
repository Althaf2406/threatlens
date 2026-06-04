"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ProjectShell } from "@/components/ProjectShell";
import { getProjectById } from "@/lib/mock-data";

export default function ReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const project = getProjectById(projectId);
  
  const [generating, setGenerating] = useState(false);
  const [recentReports, setRecentReports] = useState([
    { id: 'rep-01', name: 'Executive Summary Q3', date: '2 days ago', type: 'Executive', status: 'Ready' },
    { id: 'rep-02', name: 'Full Technical Audit', date: '1 week ago', type: 'Technical', status: 'Ready' }
  ]);

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

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setRecentReports([
        { id: `rep-${Date.now()}`, name: 'On-Demand Security Scan', date: 'Just now', type: 'Custom', status: 'Ready' },
        ...recentReports
      ]);
    }, 2000);
  };

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Security Reports"
      subtitle="Generate, view, and export compliance and security reports."
      tokenUsed={project.tokenUsed}
    >
      <div className="grid xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">Generate Report</h2>
          <p className="mt-2 text-sm text-slate-400">
            Create a point-in-time snapshot of your project's security posture.
          </p>
          
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Report Type</label>
              <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white">
                <option>Executive Summary (High-level overview)</option>
                <option>Technical Details (Full finding list)</option>
                <option>Compliance Audit (Standards mapping)</option>
                <option>Remediation Plan (Actionable tasks)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Format</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950 px-4 py-2 rounded-xl border border-slate-700 cursor-pointer">
                  <input type="radio" name="format" defaultChecked className="text-blue-500 bg-slate-800 border-slate-600 focus:ring-blue-500" />
                  PDF
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950 px-4 py-2 rounded-xl border border-slate-700 cursor-pointer">
                  <input type="radio" name="format" className="text-blue-500 bg-slate-800 border-slate-600 focus:ring-blue-500" />
                  CSV
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950 px-4 py-2 rounded-xl border border-slate-700 cursor-pointer">
                  <input type="radio" name="format" className="text-blue-500 bg-slate-800 border-slate-600 focus:ring-blue-500" />
                  JSON
                </label>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={generating}
              className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:bg-blue-800 disabled:text-slate-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : "Generate Report"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">Recent Reports</h2>
          <p className="mt-2 text-sm text-slate-400">
            Previously generated reports available for download.
          </p>

          <div className="mt-6 space-y-3">
            {recentReports.map(report => (
              <div key={report.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div>
                  <h3 className="font-medium text-white">{report.name}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{report.type}</span>
                    <span>&bull;</span>
                    <span>{report.date}</span>
                  </div>
                </div>
                
                <button className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-2 rounded-lg transition" title="Download">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProjectShell>
  );
}