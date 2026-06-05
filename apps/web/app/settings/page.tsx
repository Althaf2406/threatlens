"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { getUsageSettings, updateSettings, getDetectionRules, updateDetectionRule, resetDetectionRule, getCurrentUser } from "@/lib/api";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [rules, setRules] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  const [editingRule, setEditingRule] = useState<any>(null);
  const [thresholdInput, setThresholdInput] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      const settingsData = await getUsageSettings();
      setSettings(settingsData);
      
      if (user.role === "admin") {
        const rulesData = await getDetectionRules();
        setRules(rulesData);
      }
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
    
    setSettings((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggleRule = async (ruleId: string, currentStatus: boolean) => {
    try {
      await updateDetectionRule(ruleId, { enabled: !currentStatus });
      setRules(rules.map(r => r.id === ruleId ? { ...r, enabled: !currentStatus } : r));
    } catch (err: any) {
      alert("Failed to toggle rule: " + err.message);
    }
  };

  const handleResetRule = async (ruleId: string) => {
    try {
      const resetRule = await resetDetectionRule(ruleId);
      setRules(rules.map(r => r.id === ruleId ? resetRule : r));
    } catch (err: any) {
      alert("Failed to reset rule: " + err.message);
    }
  };

  const handleSaveThreshold = async () => {
    if (!editingRule) return;
    try {
      // Validasi JSON
      if (thresholdInput.trim() !== "") {
        JSON.parse(thresholdInput);
      }
      
      const updatedRule = await updateDetectionRule(editingRule.id, { 
        thresholdJson: thresholdInput.trim() === "" ? null : thresholdInput 
      });
      setRules(rules.map(r => r.id === updatedRule.id ? updatedRule : r));
      setEditingRule(null);
    } catch (err: any) {
      alert("Invalid JSON or failed to update: " + err.message);
    }
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
      <div className="grid gap-6 xl:grid-cols-4">
        {/* Navigation Sidebar */}
        <div className="xl:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab("general")}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition ${activeTab === "general" ? "bg-slate-800 text-white" : "hover:bg-slate-800/50 text-slate-400"}`}
          >
            General Preferences
          </button>
          <button 
            onClick={() => setActiveTab("detection_rules")}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition ${activeTab === "detection_rules" ? "bg-slate-800 text-white" : "hover:bg-slate-800/50 text-slate-400"}`}
          >
            Detection Rules
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800/50 text-slate-400 font-medium transition">
            API Keys & Integrations
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800/50 text-slate-400 font-medium transition">
            Team Members
          </button>
        </div>

        {/* Content Area */}
        <div className="xl:col-span-3">
          {activeTab === "general" && (
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
          )}

          {activeTab === "detection_rules" && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
              <h3 className="text-xl font-semibold text-white mb-2">Detection Rule Management</h3>
              <p className="text-sm text-slate-400 mb-6">Detection rules only control defensive analysis and evidence classification. They do not perform offensive actions.</p>
              
              {currentUser?.role !== "admin" ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center">
                  <p className="text-slate-400">Only administrators can manage detection rules.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rules.map((rule) => (
                    <div key={rule.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-white">{rule.name}</h4>
                          {rule.enabled ? (
                            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">Enabled</span>
                          ) : (
                            <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-xs font-medium text-slate-400">Disabled</span>
                          )}
                          {rule.defensiveOnly && (
                            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">Defensive Only</span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mb-2">{rule.key} | {rule.category}</div>
                        <div className="text-sm text-slate-400 mb-2">
                          <span className="mr-3">Severity: <span className="text-slate-300">{rule.severity}</span></span>
                          <span>Confidence Base: <span className="text-slate-300">{rule.confidenceBase}</span></span>
                        </div>
                        {rule.thresholdJson && (
                          <div className="text-xs bg-slate-900 p-2 rounded text-slate-300 font-mono inline-block">
                            {rule.thresholdJson}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => {
                            setEditingRule(rule);
                            setThresholdInput(rule.thresholdJson || "");
                          }}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700"
                        >
                          Edit Threshold
                        </button>
                        <button 
                          onClick={() => handleToggleRule(rule.id, rule.enabled)}
                          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${rule.enabled ? 'border border-red-900/50 bg-red-900/20 text-red-400 hover:bg-red-900/40' : 'border border-green-900/50 bg-green-900/20 text-green-400 hover:bg-green-900/40'}`}
                        >
                          {rule.enabled ? 'Disable' : 'Enable'}
                        </button>
                        <button 
                          onClick={() => handleResetRule(rule.id)}
                          className="rounded-lg border border-slate-700 bg-transparent px-3 py-1.5 text-sm font-medium text-slate-400 transition hover:text-white"
                          title="Reset to default"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Threshold Edit Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Edit Threshold</h3>
            <p className="text-sm text-slate-400 mb-4">Editing threshold for <span className="font-semibold text-white">{editingRule.name}</span></p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Threshold JSON Configuration</label>
              <textarea 
                value={thresholdInput}
                onChange={(e) => setThresholdInput(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 focus:border-blue-500 focus:outline-none font-mono h-40"
                placeholder='{"example": "value"}'
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setEditingRule(null)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveThreshold}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
