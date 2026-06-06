"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { getUsageSettings, updateSettings, getDetectionRules, updateDetectionRule, resetDetectionRule, getCurrentUser, getSecurityStandards, importSecurityStandards, activateSecurityStandard, updateAiMode } from "@/lib/api";
import { PLANS } from "@/lib/plans";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [rules, setRules] = useState<any[]>([]);
  const [standards, setStandards] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [aiModeSaving, setAiModeSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  const [editingRule, setEditingRule] = useState<any>(null);
  const [thresholdInput, setThresholdInput] = useState("");

  // Standards State
  const [importJson, setImportJson] = useState("");
  const [importing, setImporting] = useState(false);
  const [selectedStandardId, setSelectedStandardId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      const settingsData = await getUsageSettings();
      setSettings(settingsData);
      
      if (user.role === "admin" || user.role === "system_admin") {
        const rulesData = await getDetectionRules();
        setRules(rulesData);
        const stdsData = await getSecurityStandards();
        setStandards(stdsData);
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

  const handleImportStandards = async () => {
    try {
      setImporting(true);
      const parsed = JSON.parse(importJson);
      const newStd = await importSecurityStandards(parsed);
      setStandards([...standards, newStd]);
      setImportJson("");
      alert("Standards imported successfully");
    } catch (err: any) {
      alert("Import failed: " + err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleActivateStandard = async (id: string) => {
    try {
      await activateSecurityStandard(id);
      const stdsData = await getSecurityStandards();
      setStandards(stdsData);
    } catch (err: any) {
      alert("Failed to activate: " + err.message);
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
          <button 
            onClick={() => setActiveTab("standards")}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition ${activeTab === "standards" ? "bg-slate-800 text-white" : "hover:bg-slate-800/50 text-slate-400"}`}
          >
            Security Standards
          </button>
          <button 
            onClick={() => setActiveTab("plans_usage")}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition ${activeTab === "plans_usage" ? "bg-slate-800 text-white" : "hover:bg-slate-800/50 text-slate-400"}`}
          >
            Plans & Usage
          </button>
          <button 
            onClick={() => setActiveTab("ai_guardrails")}
            className={`w-full text-left px-4 py-3 rounded-xl font-medium transition ${activeTab === "ai_guardrails" ? "bg-slate-800 text-white" : "hover:bg-slate-800/50 text-slate-400"}`}
          >
            AI Provider & Guardrails
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

          {activeTab === "standards" && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
              <h3 className="text-xl font-semibold text-white mb-2">Security Standards Data</h3>
              <p className="text-sm text-slate-400 mb-6">Standards mapping is used as defensive guidance and does not represent formal compliance certification.</p>
              
              {currentUser?.role !== "admin" && currentUser?.role !== "system_admin" ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center">
                  <p className="text-slate-400">Only administrators can manage security standards data.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Standards Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="bg-slate-950/50 text-xs uppercase text-slate-400">
                        <tr>
                          <th className="px-6 py-4 font-medium">Framework</th>
                          <th className="px-6 py-4 font-medium">Version</th>
                          <th className="px-6 py-4 font-medium">Name</th>
                          <th className="px-6 py-4 font-medium">Controls</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 bg-slate-900/20">
                        {standards.map((std) => (
                          <tr key={std.id} className="transition-colors hover:bg-slate-800/20">
                            <td className="px-6 py-4 font-medium text-white">{std.framework}</td>
                            <td className="px-6 py-4">{std.version}</td>
                            <td className="px-6 py-4">{std.name}</td>
                            <td className="px-6 py-4">{std.controls?.length || 0}</td>
                            <td className="px-6 py-4">
                              {std.isActive ? (
                                <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">Active</span>
                              ) : (
                                <span className="rounded-full bg-slate-500/10 px-2 py-1 text-xs font-medium text-slate-400">Inactive</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {!std.isActive && (
                                <button 
                                  onClick={() => handleActivateStandard(std.id)}
                                  className="text-blue-400 hover:text-blue-300 mr-4 font-medium text-xs uppercase tracking-wider"
                                >
                                  Activate
                                </button>
                              )}
                              <button 
                                onClick={() => setSelectedStandardId(selectedStandardId === std.id ? null : std.id)}
                                className="text-slate-400 hover:text-white font-medium text-xs uppercase tracking-wider"
                              >
                                {selectedStandardId === std.id ? "Hide" : "View"} Controls
                              </button>
                            </td>
                          </tr>
                        ))}
                        {standards.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No standards found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Selected Standard Controls */}
                  {selectedStandardId && (
                    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
                      <h4 className="text-lg font-medium text-white mb-4">Controls</h4>
                      <div className="space-y-3">
                        {standards.find(s => s.id === selectedStandardId)?.controls?.map((c: any) => (
                          <div key={c.id} className="rounded-lg bg-slate-900 p-4 border border-slate-800">
                            <div className="flex gap-2 items-center mb-2">
                              <span className="font-mono text-sm text-blue-400">{c.controlId}</span>
                              <span className="font-medium text-white">{c.title}</span>
                              {c.category && <span className="ml-auto text-xs text-slate-500">{c.category}</span>}
                            </div>
                            {c.defensiveGuidance && (
                              <p className="text-sm text-slate-400 mt-1">Guidance: {c.defensiveGuidance}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Import Section */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-6">
                    <h4 className="font-medium text-white mb-2">Import Standard (JSON)</h4>
                    <p className="text-xs text-slate-500 mb-4">Paste standard schema JSON including controls array to import a new framework.</p>
                    <textarea 
                      value={importJson}
                      onChange={(e) => setImportJson(e.target.value)}
                      className="w-full h-32 rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-300 font-mono mb-3 focus:border-blue-500 focus:outline-none"
                      placeholder='{ "framework": "OWASP", "version": "2021", "name": "...", "controls": [ { "control_id": "...", "title": "..." } ] }'
                    />
                    <button 
                      onClick={handleImportStandards}
                      disabled={importing || !importJson.trim()}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
                    >
                      {importing ? "Importing..." : "Import Data"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "plans_usage" && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
              <h3 className="text-xl font-semibold text-white mb-2">Plans & Usage</h3>
              <p className="text-sm text-slate-400 mb-6">View your current usage and explore available plans.</p>
              
              <div className="mb-8 rounded-xl border border-slate-800 bg-slate-950 p-6">
                <h4 className="font-semibold text-white mb-4">Current Usage</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Projects</p>
                    <p className="text-xl font-bold text-white">{settings?.projectLimit ? (settings.projectLimit > 10 ? 'Unlimited' : `${Math.min(settings.projectLimit, 10)} / ${settings.projectLimit}`) : "0 / 3"}</p>
                    <p className="text-xs text-blue-400 mt-1 uppercase tracking-wider">{settings?.planName || "free"} Plan</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">AI Tokens</p>
                    <p className="text-xl font-bold text-white">{settings?.tokenUsed || 0} / {settings?.tokenLimit || 1000}</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
                      <div 
                        className={`h-1.5 rounded-full ${
                          ((settings?.tokenUsed || 0) / (settings?.tokenLimit || 1000)) > 0.8 ? "bg-red-500" : "bg-blue-500"
                        }`} 
                        style={{ width: `${Math.min(((settings?.tokenUsed || 0) / (settings?.tokenLimit || 1000)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-white mb-4">Available Plans</h4>
              <div className="grid gap-4 md:grid-cols-3">
                {Object.values(PLANS).map((plan) => (
                  <div key={plan.id} className={`rounded-xl border p-5 flex flex-col ${settings?.planName === plan.id ? 'border-blue-500 bg-blue-900/10' : 'border-slate-800 bg-slate-950'}`}>
                    <h5 className="font-bold text-white text-lg">{plan.name}</h5>
                    <p className="text-xs text-slate-400 mt-1">{plan.bestFor}</p>
                    <div className="mt-4 mb-4">
                      <span className="text-2xl font-bold text-white">{plan.price}</span>
                    </div>
                    <ul className="space-y-2 mt-auto">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.id === "free" && (
                      <span className="mt-4 inline-block text-center rounded-lg bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">Recommended for students</span>
                    )}
                    {plan.id === "pro" && (
                      <span className="mt-4 inline-block text-center rounded-lg border border-blue-500/30 px-3 py-1 text-xs font-medium text-blue-400">Optional upgrade later</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "ai_guardrails" && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
              <h3 className="text-xl font-semibold text-white mb-2">AI Provider & Cost Guardrails</h3>
              <p className="text-sm text-slate-400 mb-6">Manage how AI summaries are generated and enforce safety rules.</p>
              
              <div className="mb-8 rounded-xl border border-slate-800 bg-slate-950 p-6">
                <h4 className="font-semibold text-white mb-4">AI Provider Mode</h4>
                <div className="space-y-3">
                  {[
                    { id: "template_local", name: "Local Template (Default)", desc: "Free, deterministic, safe for MVP." },
                    { id: "ollama_local", name: "Ollama Local", desc: "Local model, no API cost, depends on laptop specs." },
                    { id: "lm_studio_local", name: "LM Studio", desc: "Local model via LM Studio server." },
                    { id: "openai_api", name: "OpenAI API", desc: "Optional paid API. Requires key." },
                    { id: "gemini_api", name: "Gemini API", desc: "Optional paid API. Requires key." },
                    { id: "groq_api", name: "Groq API", desc: "Optional fast API. Requires key." }
                  ].map(mode => (
                    <label key={mode.id} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${settings?.aiMode === mode.id ? 'border-blue-500 bg-blue-900/10' : 'border-slate-800 hover:bg-slate-900'}`}>
                      <input 
                        type="radio" 
                        name="aiMode" 
                        value={mode.id}
                        checked={settings?.aiMode === mode.id}
                        onChange={async (e) => {
                          handleChange(e);
                          setAiModeSaving(true);
                          try {
                            await updateAiMode(e.target.value);
                            setSuccessMsg("AI Mode updated.");
                            setTimeout(() => setSuccessMsg(""), 3000);
                          } catch (err: any) {
                            alert("Failed to update AI mode: " + err.message);
                            // Revert on fail
                            setSettings((prev: any) => ({ ...prev, aiMode: settings?.aiMode }));
                          } finally {
                            setAiModeSaving(false);
                          }
                        }}
                        className="mt-1 h-4 w-4 border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{mode.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{mode.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {aiModeSaving && <p className="text-xs text-blue-400 mt-3">Saving...</p>}
                {successMsg && <p className="text-xs text-green-400 mt-3">{successMsg}</p>}
              </div>

              <div className="rounded-xl border border-red-900/30 bg-red-900/10 p-6">
                <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Cost & Safety Guardrails
                </h4>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Use local/template mode by default to prevent accidental spending.</li>
                  <li>• Generated AI summaries are cached to avoid double-charging tokens.</li>
                  <li>• API keys are never stored in client-side code (use environment variables).</li>
                  <li>• Never send secrets, passwords, raw tokens, or sensitive logs to AI providers.</li>
                  <li>• Do not put API keys in frontend. Set provider budget/spend limit outside the app.</li>
                  <li>• Prefer short prompts and compact evidence.</li>
                </ul>
              </div>
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
