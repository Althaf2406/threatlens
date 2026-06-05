"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectShell } from "@/components/ProjectShell";
import { createProjectAsset } from "@/lib/api";

export default function NewAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    type: "website_url",
    value: "",
    environment: "production",
    description: "",
    tags_json: "",
    notes: "",
    ownership_confirmed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ownership_confirmed) {
      setError("You must confirm ownership to add this asset.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const payload = { ...formData };
      
      const asset = await createProjectAsset(projectId, payload);
      router.push(`/projects/${projectId}/assets/${asset.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create asset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  return (
    <ProjectShell
      projectId={projectId}
      title="Add Asset"
      subtitle="Register a new asset to monitor within this project workspace."
    >
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            {error && (
              <div className="mb-6 rounded-xl border border-red-800 bg-red-900/30 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Asset Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Core API Service"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Asset Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="website_url">Website URL</option>
                    <option value="api_endpoint">API Endpoint</option>
                    <option value="repository">Repository</option>
                    <option value="cloud_indicator">Cloud Indicator</option>
                    <option value="demo_target">Demo Target</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Environment <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="environment"
                    required
                    value={formData.environment}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="local">Local</option>
                    <option value="lab">Lab</option>
                    <option value="demo">Demo</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Value / Identifier <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="value"
                  required
                  value={formData.value}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://api.example.com"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Optional description of this asset"
                />
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags_json"
                  value={formData.tags_json}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. backend, payment, pci"
                />
              </div>

              <div className="mt-6 rounded-xl border border-blue-900/50 bg-blue-950/20 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="flex h-5 items-center">
                    <input
                      type="checkbox"
                      name="ownership_confirmed"
                      required
                      checked={formData.ownership_confirmed}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-white block mb-1">
                      Ownership Confirmation <span className="text-red-400">*</span>
                    </span>
                    <span className="text-slate-400">
                      I confirm that this asset belongs to me, my team, a staging/demo environment, or a lab environment that I am authorized to analyze. ThreatLens is a defensive tool and must not be used for offensive purposes.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Asset"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-slate-700 bg-transparent px-6 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ProjectShell>
  );
}
