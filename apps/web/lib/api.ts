export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

// Helper to convert snake_case string to camelCase
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

// Deep mapper for snake_case keys to camelCase
function mapKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => mapKeysToCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => {
        result[toCamelCase(key)] = mapKeysToCamelCase(obj[key]);
        return result;
      },
      {} as any
    );
  }
  return obj;
}

export async function fetchJson(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (typeof window === "undefined") {
      try {
        const { cookies } = require("next/headers");
        const cookieStore = await cookies();
        const cookieArray = cookieStore.getAll();
        if (cookieArray && cookieArray.length > 0) {
          const cookieStr = cookieArray.map((c: any) => `${c.name}=${c.value}`).join('; ');
          headers["Cookie"] = cookieStr;
        }
      } catch (e) {
        console.warn("Could not attach cookies on server:", e);
      }
    }

    const response = await fetch(url, {
      ...options,
      credentials: "include", // Send HTTP-Only cookies with requests (client side)
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
      }
      if (response.status === 403) {
        throw new Error("FORBIDDEN");
      }
      if (response.status === 404) {
        throw new Error("NOT_FOUND");
      }

      const errText = await response.text();
      let errorDetail = errText;
      try {
        const errJson = JSON.parse(errText);
        errorDetail = errJson.detail || errText;
      } catch (e) { }

      throw new Error(errorDetail || `API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return mapKeysToCamelCase(data);
  } catch (error: any) {
    throw error;
  }
}

// ---------------------------------------------------------
// Auth
// ---------------------------------------------------------
export async function registerUser(data: any) {
  return fetchJson("/auth/register", { method: "POST", body: JSON.stringify(data) });
}

export async function loginUser(data: any) {
  return fetchJson("/auth/login", { method: "POST", body: JSON.stringify(data) });
}

export async function logoutUser() {
  return fetchJson("/auth/logout", { method: "POST" });
}

export async function getCurrentUser() {
  return fetchJson("/auth/me");
}

// ---------------------------------------------------------
// Projects
// ---------------------------------------------------------
export async function getProjects() {
  return fetchJson("/projects/");
}

export async function getProject(projectId: string) {
  return fetchJson(`/projects/${projectId}`);
}

export async function createProject(data: any) {
  return fetchJson("/projects/", { method: "POST", body: JSON.stringify(data) });
}

export async function updateProject(projectId: string, data: any) {
  return fetchJson(`/projects/${projectId}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteProject(projectId: string) {
  return fetchJson(`/projects/${projectId}`, { method: "DELETE" });
}

// ---------------------------------------------------------
// Assets & Passive Checker
// ---------------------------------------------------------
export async function getProjectAssets(projectId: string) {
  return fetchJson(`/projects/${projectId}/assets`);
}

export async function getProjectAsset(projectId: string, assetId: string) {
  return fetchJson(`/projects/${projectId}/assets/${assetId}`);
}

export async function createProjectAsset(projectId: string, data: any) {
  return fetchJson(`/projects/${projectId}/assets`, { method: "POST", body: JSON.stringify(data) });
}

export async function updateProjectAsset(projectId: string, assetId: string, data: any) {
  return fetchJson(`/projects/${projectId}/assets/${assetId}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteProjectAsset(projectId: string, assetId: string) {
  return fetchJson(`/projects/${projectId}/assets/${assetId}`, { method: "DELETE" });
}

export async function confirmProjectAssetOwnership(projectId: string, assetId: string) {
  return fetchJson(`/projects/${projectId}/assets/${assetId}/confirm-ownership`, { method: "POST" });
}

export async function runPassiveCheck(projectId: string, assetId: string) {
  return fetchJson(`/projects/${projectId}/assets/${assetId}/passive-check`, { method: "POST" });
}

// ---------------------------------------------------------
// Scans
// ---------------------------------------------------------
export async function getProjectScans(projectId: string) {
  return fetchJson(`/projects/${projectId}/scans`);
}

export async function getProjectScanDetail(projectId: string, scanId: string) {
  return fetchJson(`/projects/${projectId}/scans/${scanId}`);
}

export async function compareProjectScans(projectId: string, beforeScanId: string, afterScanId: string) {
  return fetchJson(`/projects/${projectId}/scans/compare`, {
    method: "POST",
    body: JSON.stringify({ before_scan_id: beforeScanId, after_scan_id: afterScanId })
  });
}

export async function getProjectSecurityImprovement(projectId: string) {
  return fetchJson(`/projects/${projectId}/security-improvement`);
}

// ---------------------------------------------------------
// Findings
// ---------------------------------------------------------
export async function getProjectFindings(projectId: string) {
  return fetchJson(`/projects/${projectId}/findings`);
}

export async function getFindingDetail(projectId: string, findingId: string) {
  return fetchJson(`/projects/${projectId}/findings/${findingId}`);
}

// ---------------------------------------------------------
// Timeline
// ---------------------------------------------------------
export async function getProjectTimeline(projectId: string) {
  return fetchJson(`/projects/${projectId}/timeline`);
}

// ---------------------------------------------------------
// Graph
// ---------------------------------------------------------
export async function getProjectGraph(projectId: string) {
  return fetchJson(`/projects/${projectId}/graph`);
}

// ---------------------------------------------------------
// Lab
// ---------------------------------------------------------
export async function generateSyntheticEvents(projectId: string, scenarioId: string) {
  return fetchJson(`/projects/${projectId}/lab/generate`, {
    method: "POST",
    body: JSON.stringify({ scenario_id: scenarioId }),
  });
}

export async function getProjectEvents(projectId: string) {
  return fetchJson(`/projects/${projectId}/events`);
}

// ---------------------------------------------------------
// Remediation
// ---------------------------------------------------------
export async function getProjectRemediation(projectId: string) {
  return fetchJson(`/projects/${projectId}/remediation`);
}

export async function updateRemediationTask(projectId: string, taskId: string, status: string) {
  return fetchJson(`/projects/${projectId}/remediation/${taskId}`, {
    method: "PUT",
    body: JSON.stringify({ status })
  });
}

// ---------------------------------------------------------
// Standards
// ---------------------------------------------------------
export async function getProjectStandards(projectId: string) {
  return fetchJson(`/projects/${projectId}/standards`);
}

// ---------------------------------------------------------
// Reports
// ---------------------------------------------------------
export async function getProjectReports(projectId: string) {
  return fetchJson(`/projects/${projectId}/reports`);
}

export async function generateProjectReport(projectId: string, type: string) {
  return fetchJson(`/projects/${projectId}/reports`, {
    method: "POST",
    body: JSON.stringify({ type })
  });
}

// ---------------------------------------------------------
// Settings
// ---------------------------------------------------------
export async function getUsageSettings() {
  return fetchJson(`/settings/usage`);
}

export async function updateSettings(data: any) {
  // Mock endpoint since backend only supports updateDetectionRule currently
  console.log("Mock updateSettings", data);
  return { msg: "Settings updated" };
}

export async function getDetectionRules() {
  return fetchJson(`/settings/detection-rules`);
}

export async function getDetectionRule(ruleId: string) {
  return fetchJson(`/settings/detection-rules/${ruleId}`);
}

export async function updateDetectionRule(ruleId: string, payload: any) {
  return fetchJson(`/settings/detection-rules/${ruleId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function resetDetectionRule(ruleId: string) {
  return fetchJson(`/settings/detection-rules/${ruleId}/reset`, {
    method: "POST"
  });
}

// ---------------------------------------------------------
// AI Investigation Summaries
// ---------------------------------------------------------
export async function getProjectAISummaries(projectId: string) {
  return fetchJson(`/projects/${projectId}/ai-summaries`);
}

export async function generateProjectAISummary(projectId: string, payload: any) {
  return fetchJson(`/projects/${projectId}/ai-summaries`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function getProjectAISummary(projectId: string, summaryId: string) {
  return fetchJson(`/projects/${projectId}/ai-summaries/${summaryId}`);
}
