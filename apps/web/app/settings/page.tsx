"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { getUsageSettings, updateSettings } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsageSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.message || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg("");
      await updateSettings(settings);
      setSuccessMsg("Settings saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      alert("Failed to save settings: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <AppShell title="Settings" subtitle="System preferences">
        <LoadingState message="Loading settings..." />
      </AppShell>
    );
  }

  if (error || !settings) {
    return (
      <AppShell title="Settings" subtitle="System preferences">
        <ErrorState message={error || "Failed to load"} onRetry={loadData} />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Settings"
      subtitle="Manage your ThreatLens preferences, limits, and integrations."
    >
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Navigation Sidebar */}
        <div className="xl:col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 text-white font-medium">
            General Preferences
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800/50 text-slate-400 font-medium transition">
            API Keys & Integrations
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800/50 text-slate-400 font-medium transition">
            Team Members
          </button>
        </div>

        {/* Content Area */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
            <h3 className="text-xl font-semibold text-white mb-6">General Preferences</h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Project Limit</label>
                  <input 
                    type="number" 
                    name="projectLimit"
                    value={settings.projectLimit || 3}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 focus:border-blue-500 focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-slate-500">Maximum active projects allowed</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">AI Token Limit</label>
                  <input 
                    type="number" 
                    name="tokenLimit"
                    value={settings.tokenLimit || 1000}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 focus:border-blue-500 focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-slate-500">Monthly token limit for AI analysis</p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    name="allowDataExport"
                    checked={settings.allowDataExport !== false}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-300">Allow Data Export</span>
                </label>
                <p className="mt-1 text-xs text-slate-500 ml-8">Allow users to export findings and reports to PDF/CSV.</p>
              </div>

              <div className="border-t border-slate-800 pt-6">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    name="enableAiAnalysis"
                    checked={settings.enableAiAnalysis !== false}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-300">Enable AI Analysis (Mock)</span>
                </label>
                <p className="mt-1 text-xs text-slate-500 ml-8">Enable synthetic LLM-based investigation features.</p>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </button>
                
                {successMsg && (
                  <span className="text-sm text-green-400 font-medium">{successMsg}</span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
