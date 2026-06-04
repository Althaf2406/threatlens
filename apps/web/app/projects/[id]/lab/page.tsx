"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ProjectShell } from "@/components/ProjectShell";
import { getProjectById, getEventsByProjectId } from "@/lib/mock-data";

const scenarios = [
  { id: "failed_login_spike", name: "Failed Login Spike" },
  { id: "impossible_travel", name: "Impossible Travel" },
  { id: "new_device_admin_action", name: "New Device Admin Action" },
  { id: "token_reuse", name: "Token Reuse" },
  { id: "suspicious_data_export", name: "Suspicious Data Export" }
];

export default function LabPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0].id);
  const [generatedEvents, setGeneratedEvents] = useState<any[]>([]);

  const project = getProjectById(projectId);
  const existingEvents = getEventsByProjectId(projectId).filter(e => e.isSynthetic);

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
    const scenario = scenarios.find(s => s.id === selectedScenario);
    const newEvent = {
      id: `syn-${Date.now()}`,
      eventType: scenario?.name || "Synthetic Event",
      timestamp: new Date().toISOString(),
      user: "synthetic_user",
      ip: "10.0.0." + Math.floor(Math.random() * 255),
      country: "US",
      device: "Python Script",
      endpoint: "/api/test",
      severity: "High",
      riskScore: 80,
      isSynthetic: true,
      scenarioId: selectedScenario
    };
    
    setGeneratedEvents([newEvent, ...generatedEvents]);
  };

  const allSyntheticEvents = [...generatedEvents, ...existingEvents];

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.name}
      title="Security Lab"
      subtitle="Safely generate synthetic defensive events to test detection rules."
      tokenUsed={project.tokenUsed}
    >
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">Generate Events</h2>
          <p className="mt-2 text-sm text-slate-400">
            Select a scenario to simulate logs. These logs are purely synthetic and do not interact with actual project infrastructure. 
            No exploit payloads or brute force attacks are executed.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Scenario</label>
              <select 
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white"
              >
                {scenarios.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={handleGenerate}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Generate Synthetic Events
            </button>
          </div>
        </div>

        <div className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">Synthetic Event Log</h2>
          
          <div className="mt-5 space-y-3">
            {allSyntheticEvents.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-slate-500">No synthetic events generated yet.</p>
              </div>
            ) : (
              allSyntheticEvents.map((event) => (
                <div key={event.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded bg-purple-500/20 px-2 py-1 text-xs font-medium text-purple-300">
                      Synthetic Data
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-medium text-white">{event.eventType}</h3>
                  <div className="mt-2 flex gap-4 text-sm text-slate-400">
                    <p>IP: {event.ip}</p>
                    <p>User: {event.user}</p>
                    <p>Endpoint: {event.endpoint}</p>
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