"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { createProject } from "@/lib/api";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [environment, setEnvironment] = useState("Demo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      await createProject({
        name,
        description,
        environment
      });
      router.push("/projects");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create project");
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Create Project"
      subtitle="Create a new workspace for security analysis."
    >
      <div className="max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Project Information</h2>
        <p className="mt-2 text-sm text-slate-400">
          Configure your new security analysis workspace.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-300">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Demo Web App"
              required
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description about this project"
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">
              Environment
            </label>
            <select 
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
            >
              <option value="Staging">Staging</option>
              <option value="Demo">Demo</option>
              <option value="Lab">Lab</option>
              <option value="Development">Development</option>
              <option value="Production">Production</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/projects"
              className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Project"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
