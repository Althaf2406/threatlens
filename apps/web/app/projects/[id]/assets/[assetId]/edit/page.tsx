"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProjectShell } from "@/components/ProjectShell";
import { getProjectAsset, updateProjectAsset } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function EditAssetPage({ params }: { params: Promise<{ id: string, assetId: string }> }) {
  const { id: projectId, assetId } = use(params);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    type: "website_url",
    value: "",
    environment: "production",
    status: "active",
    description: "",
    tags_json: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAsset = async () => {
      try {
        setLoading(true);
        const asset = await getProjectAsset(projectId, assetId);
        setFormData({
          name: asset.name || "",
          type: asset.type || "website_url",
          value: asset.value || "",
          environment: asset.environment || "production",
          status: asset.status || "active",
          description: asset.description || "",
          tags_json: asset.tagsJson || "",
          notes: asset.notes || "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load asset details");
      } finally {
        setLoading(false);
      }
    };
    loadAsset();
  }, [projectId, assetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await updateProjectAsset(projectId, assetId, formData);
      router.push(`/projects/${projectId}/assets/${assetId}`);
    } catch (err: any) {
      setError(err.message || "Failed to update asset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <ProjectShell projectId={projectId} title="Edit Asset">
        <LoadingState message="Loading asset data..." />
      </ProjectShell>
    );
  }

  if (error && !formData.name) {
    return (
      <ProjectShell projectId={projectId} title="Edit Asset">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </ProjectShell>
    );
  }

  return (
    <ProjectShell
      projectId={projectId}
      title="Edit Asset"
      subtitle="Update the configuration and details for this asset."
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
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Status <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="needs_review">Needs Review</option>
                    <option value="inactive">Inactive</option>
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
                  rows={3}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Internal Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Private notes visible only to project members"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
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
