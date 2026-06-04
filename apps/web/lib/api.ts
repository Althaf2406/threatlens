export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchJson(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Fetch error on ${endpoint}:`, error);
    throw error;
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

// ---------------------------------------------------------
// Assets & Passive Checker
// ---------------------------------------------------------
export async function getProjectAssets(projectId: string) {
  return fetchJson(`/projects/${projectId}/assets`);
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
