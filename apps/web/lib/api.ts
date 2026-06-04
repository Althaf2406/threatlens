export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
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
  // Option to explicitly use mock data if backend isn't ready
  if (USE_MOCK_API) {
    console.warn(`[API Mock Fallback] using mock for ${endpoint}`);
    // We would import mockData and simulate response here if needed.
    // For now, if USE_MOCK_API is true, we throw an error instructing to handle mock explicitly in the caller, 
    // or just return mock data if imported. We'll throw to ensure callers know.
    throw new Error("MOCK_FALLBACK_REQUESTED");
  }

  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      // cache: "no-store", // depending on Next.js setup, we might want fresh data
    });
    
    if (!response.ok) {
      // Handle non-2xx responses strictly
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return mapKeysToCamelCase(data);
  } catch (error: any) {
    console.error(`Fetch error on ${endpoint}:`, error);
    // Don't silent fail, throw explicitly
    throw new Error(error.message || `Failed to fetch ${endpoint}`);
  }
}

// ---------------------------------------------------------
// Projects
// ---------------------------------------------------------
export async function getProjects() {
  return fetchJson("/projects");
}

export async function getProject(projectId: string) {
  return fetchJson(`/projects/${projectId}`);
}

export async function createProject(data: any) {
  return fetchJson("/projects", { method: "POST", body: JSON.stringify(data) });
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

export async function createProjectAsset(projectId: string, data: any) {
  return fetchJson(`/projects/${projectId}/assets`, { method: "POST", body: JSON.stringify(data) });
}

export async function updateAsset(assetId: string, data: any) {
  return fetchJson(`/assets/${assetId}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteAsset(assetId: string) {
  return fetchJson(`/assets/${assetId}`, { method: "DELETE" });
}

export async function runPassiveCheck(projectId: string, assetId: string) {
  return fetchJson(`/projects/${projectId}/assets/${assetId}/passive-check`, { method: "POST" });
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

export async function getDetectionRules() {
  return fetchJson(`/settings/detection-rules`);
}

export async function updateDetectionRule(ruleId: string, enabled: boolean) {
  return fetchJson(`/settings/detection-rules/${ruleId}`, {
    method: "PUT",
    body: JSON.stringify({ enabled })
  });
}
