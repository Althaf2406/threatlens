"use client";

import { use } from "react";
import Link from "next/link";
import { ProjectShell } from "@/components/ProjectShell";
import { getProjectById } from "@/lib/mock-data";

export default function ProjectSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const project = getProjectById(projectId);

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
      title="Project Settings"
      subtitle="Manage project configuration and preferences."
      tokenUsed={project.tokenUsed}
    >
      <div className="max-w-3xl space-y-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">General Information</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
              <input 
                type="text" 
                defaultValue={project.name}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-blue-500 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Environment</label>
              <select 
                defaultValue={project.environment}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Production">Production</option>
                <option value="Staging">Staging</option>
                <option value="Demo">Demo</option>
                <option value="Lab">Lab</option>
              </select>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800">
            <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500">
              Save Changes
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-lg font-semibold text-white">Scan Preferences</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950">
              <div>
                <p className="font-medium text-slate-300">Automated Passive Scans</p>
                <p className="text-sm text-slate-500 mt-1">Run non-intrusive checks automatically on schedule.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950">
              <div>
                <p className="font-medium text-slate-300">Log Analysis AI</p>
                <p className="text-sm text-slate-500 mt-1">Use AI to automatically classify events and findings.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-red-900/30 bg-red-950/10 p-6">
          <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
          <p className="mt-2 text-sm text-slate-400">
            Irreversible actions for this project.
          </p>
          <div className="mt-6 pt-6 border-t border-slate-800">
            <button className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20">
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </ProjectShell>
  );
}
