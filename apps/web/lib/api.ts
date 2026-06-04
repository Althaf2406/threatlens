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
// Findings
// ---------------------------------------------------------
export async function getProjectFindings(projectId: string) {
  return fetchJson(`/projects/${projectId}/findings`);
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
// Remediation
// ---------------------------------------------------------
export async function getProjectRemediation(projectId: string) {
  return fetchJson(`/projects/${projectId}/remediation`);
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
