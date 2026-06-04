"use client";

import { use, useState, useEffect } from "react";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, generateSyntheticEvents, getProjectEvents } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function LabPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const [project, setProject] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedScenario, setSelectedScenario] = useState("failed_login_spike");
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projData, eventsData] = await Promise.all([
        getProject(projectId),
        getProjectEvents(projectId)
      ]);
      
      setProject(projData);
      setEvents(eventsData.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (err: any) {
      setError(err.message || "Failed to load lab data.");
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
      await generateSyntheticEvents(projectId, selectedScenario);
      
      setSuccessMessage("Synthetic events generated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
      
      // Refresh events
      const eventsData = await getProjectEvents(projectId);
      setEvents(eventsData.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (err) {
      console.error(err);
      alert("Failed to generate synthetic events.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <ProjectShell projectId={projectId} projectName="Loading..." title="Synthetic Lab" subtitle="Loading lab...">
        <LoadingState message="Loading lab environment..." />
      </ProjectShell>
    );
  }

  if (error || !project) {
    return (
      <ProjectShell projectId={projectId} projectName="Error" title="Synthetic Lab" subtitle="Failed to load">
        <ErrorState message={error || "Project not found"} onRetry={loadData} />
      </ProjectShell>
    );
  }

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Synthetic Lab"
      subtitle="Safely generate defensive metadata and mock logs to test detection rules."
      tokenUsed={project.tokenUsed}
    >
      <div className="mb-6 rounded-xl border border-blue-900/50 bg-blue-900/10 p-4 text-blue-200 text-sm">
        <strong className="text-blue-400">Safety Note:</strong> This lab only creates simulated defensive logs. It does not perform real brute force, exploit, bypass, credential theft, or target interaction.
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Generator Form */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 xl:col-span-1 h-fit">
          <h3 className="text-lg font-semibold text-white">Generate Mock Traffic</h3>
          <p className="mt-2 text-sm text-slate-400">
            Inject synthetic logs into the project pipeline.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Scenario</label>
              <select 
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 focus:border-blue-500 focus:outline-none"
              >
                <option value="failed_login_spike">Failed Login Spike</option>
                <option value="impossible_travel">Impossible Travel</option>
                <option value="new_device_admin_action">New Device Admin Action</option>
                <option value="token_reuse">Session Token Reuse</option>
                <option value="suspicious_data_export">Suspicious Data Export</option>
              </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Inject Events"}
            </button>
            
            {successMessage && (
              <p className="text-sm text-green-400 mt-2 text-center">{successMessage}</p>
            )}
          </div>
        </div>

        {/* Live Event Stream */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Latest Telemetry</h3>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
              Live updates
            </span>
          </div>

          <div className="space-y-3">
            {events.length === 0 ? (
               <p className="text-sm text-slate-500 text-center py-8">No events recorded. Generate mock traffic to see them here.</p>
            ) : (
              events.slice(0, 10).map((event) => (
                <div key={event.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        event.severity === 'High' || event.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                        event.severity === 'Medium' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {event.eventType}
                      </span>
                      {event.isSynthetic && (
                        <span className="rounded bg-indigo-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                          Synthetic Data
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                    <div>
                      <p className="text-xs text-slate-500">User</p>
                      <p className="text-slate-300">{event.user || 'System'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">IP / Country</p>
                      <p className="text-slate-300">{event.ip || 'N/A'} {event.country ? `(${event.country})` : ''}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">Endpoint</p>
                      <p className="truncate text-slate-300">{event.endpoint || 'N/A'}</p>
                    </div>
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