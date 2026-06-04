"use client";

import { use, useState, useEffect } from "react";
import { ProjectShell } from "@/components/ProjectShell";
import { getProject, getProjectTimeline } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

export default function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  
  const [project, setProject] = useState<any>(null);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [projData, eventsData] = await Promise.all([
        getProject(projectId),
        getProjectTimeline(projectId)
      ]);
      
      setProject(projData);
      setTimelineEvents(eventsData.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (err: any) {
      setError(err.message || "Failed to load timeline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  if (loading) {
    return (
      <ProjectShell projectId={projectId} projectName="Loading..." title="Incident Timeline" subtitle="Loading timeline events...">
        <LoadingState message="Loading event timeline..." />
      </ProjectShell>
    );
  }

  if (error || !project) {
    return (
      <ProjectShell projectId={projectId} projectName="Error" title="Incident Timeline" subtitle="Failed to load">
        <ErrorState message={error || "Project not found"} onRetry={loadData} />
      </ProjectShell>
    );
  }

  // Generate defensive summary
  const syntheticCount = timelineEvents.filter(e => e.isSynthetic).length;
  const highRiskCount = timelineEvents.filter(e => e.severity === 'High' || e.severity === 'Critical').length;
  
  let storyline = `The system has recorded ${timelineEvents.length} security-relevant events. `;
  if (syntheticCount > 0) storyline += `Note that ${syntheticCount} of these events were generated synthetically in the Lab environment for testing defensive rules. `;
  if (highRiskCount > 0) storyline += `There are ${highRiskCount} high-severity events that require immediate attention from the security team.`;
  else storyline += `No immediate high-severity events are present in the current timeframe.`;

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Incident Timeline"
      subtitle="Chronological view of security events, alerts, and defensive metadata."
      tokenUsed={project.tokenUsed}
    >
      <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="text-lg font-semibold text-white">Investigation Summary</h3>
        <p className="mt-2 text-slate-400 leading-relaxed">
          {storyline}
        </p>
      </div>

      <div className="relative border-l border-slate-800 ml-4 md:ml-6 space-y-8 pb-10">
        {timelineEvents.length === 0 ? (
          <div className="pl-6">
            <EmptyState 
              title="No events found" 
              message="There are no security events logged in this project's timeline yet." 
            />
          </div>
        ) : (
          timelineEvents.map((event) => (
            <div key={event.id} className="relative pl-8 md:pl-10">
              <div className={`absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full border-2 border-slate-900 ${
                event.severity === 'High' || event.severity === 'Critical' ? 'bg-red-500' : 
                event.severity === 'Medium' ? 'bg-orange-500' : 
                'bg-blue-500'
              }`}></div>
              
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4 mb-2">
                <span className="text-sm font-medium text-white">{new Date(event.timestamp).toLocaleString()}</span>
                <span className={`inline-block w-fit rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  event.severity === 'High' || event.severity === 'Critical' ? 'bg-red-500/10 text-red-400' : 
                  event.severity === 'Medium' ? 'bg-orange-500/10 text-orange-400' : 
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {event.eventType}
                </span>
                {event.isSynthetic && (
                  <span className="inline-block w-fit rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Synthetic Data
                  </span>
                )}
              </div>
              
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-xs text-slate-500">User / Actor</p>
                    <p className="mt-1 text-sm text-slate-300">{event.user || 'System'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Source IP</p>
                    <p className="mt-1 text-sm text-slate-300">{event.ip || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Target Endpoint</p>
                    <p className="mt-1 truncate text-sm text-slate-300">{event.endpoint || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Risk Score</p>
                    <p className="mt-1 text-sm font-medium text-slate-300">{event.riskScore || 0}</p>
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