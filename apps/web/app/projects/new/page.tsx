import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function NewProjectPage() {
  return (
    <AppShell
      title="Create Project"
      subtitle="Create a new workspace for security analysis."
    >
      <div className="max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-lg font-semibold text-white">Project Information</h2>
        <p className="mt-2 text-sm text-slate-400">
          This form will later be connected to the backend API.
        </p>

        <form className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-300">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Example: Demo Web App"
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              placeholder="Short description about this project"
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">
              Environment
            </label>
            <select className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500">
              <option>Staging</option>
              <option>Demo</option>
              <option>Lab</option>
              <option>Development</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/projects"
              className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="button"
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
