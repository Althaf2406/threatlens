export type Project = {
  id: string;
  name: string;
  description: string;
  environment: string;
  riskLevel: string;
  postureScore: number;
  tokenUsed: number;
  tokenLimit: number;
  createdAt: string;
  updatedAt: string;
};

export type Asset = {
  id: string;
  projectId: string;
  name: string;
  type: string;
  value: string;
  environment: string;
  ownershipConfirmed: boolean;
  status: string;
};

export type Finding = {
  id: string;
  projectId: string;
  assetId: string;
  title: string;
  category: string;
  severity: string;
  confidence: string;
  blastRadius: string;
  status: string;
  description: string;
  evidenceIds: string[];
  remediationTaskIds: string[];
  standardMappingIds: string[];
  createdAt: string;
};

export type Evidence = {
  id: string;
  findingId: string;
  source: string;
  detail: string;
  timestamp: string;
};

export type Event = {
  id: string;
  projectId: string;
  eventType: string;
  timestamp: string;
  user: string;
  ip: string;
  country: string;
  device: string;
  endpoint: string;
  severity: string;
  riskScore: number;
  isSynthetic: boolean;
  scenarioId?: string;
};

export type GraphNode = {
  id: string;
  projectId: string;
  label: string;
  type: string;
  risk: string;
  relatedFindingId?: string;
};

export type GraphEdge = {
  id: string;
  projectId: string;
  from: string;
  to: string;
  relation: string;
  evidenceId?: string;
};

export type RemediationTask = {
  id: string;
  projectId: string;
  findingId: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
};

export type StandardMapping = {
  id: string;
  findingId: string;
  framework: string;
  control: string;
  description: string;
};

export type Report = {
  id: string;
  projectId: string;
  title: string;
  type: string;
  createdAt: string;
  summary: string;
};

export type UsageLimit = {
  userId: string;
  projectUsed: number;
  projectLimit: number;
  tokenUsed: number;
  tokenLimit: number;
  planName: string;
};

export type DetectionRule = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: string;
};

// Initial Mock Data Arrays
const projects: Project[] = [
  {
    id: "proj-001",
    name: "Demo Web App",
    description: "Main testing environment for web client.",
    environment: "Staging",
    riskLevel: "High",
    postureScore: 76,
    tokenUsed: 4200,
    tokenLimit: 10000,
    createdAt: "2023-10-01",
    updatedAt: "Today",
  },
  {
    id: "proj-002",
    name: "Public API Service",
    description: "Core REST API exposed to third parties.",
    environment: "Demo",
    riskLevel: "Medium",
    postureScore: 85,
    tokenUsed: 8200,
    tokenLimit: 10000,
    createdAt: "2023-10-15",
    updatedAt: "Yesterday",
  },
  {
    id: "proj-003",
    name: "Student Portfolio App",
    description: "Lab testing ground for portfolio submissions.",
    environment: "Lab",
    riskLevel: "Low",
    postureScore: 92,
    tokenUsed: 0,
    tokenLimit: 50000,
    createdAt: "2023-10-20",
    updatedAt: "3 days ago",
  },
];

const assets: Asset[] = [
  {
    id: "ast-001",
    projectId: "proj-001",
    name: "Main Website",
    type: "Website URL",
    value: "https://demo.threatlens.local",
    environment: "Staging",
    ownershipConfirmed: true,
    status: "Ready",
  },
  {
    id: "ast-002",
    projectId: "proj-001",
    name: "Auth API",
    type: "API Endpoint",
    value: "https://api.threatlens.local/auth",
    environment: "Staging",
    ownershipConfirmed: true,
    status: "Ready",
  },
];

const findings: Finding[] = [
  {
    id: "fdg-001",
    projectId: "proj-001",
    assetId: "ast-001",
    title: "Missing HSTS Header",
    category: "Configuration",
    severity: "Medium",
    confidence: "High",
    blastRadius: "Global",
    status: "Confirmed",
    description: "The application does not enforce HTTP Strict Transport Security (HSTS), leaving it vulnerable to downgrade attacks.",
    evidenceIds: ["evd-001"],
    remediationTaskIds: ["rem-001"],
    standardMappingIds: ["std-001", "std-002"],
    createdAt: "2023-10-25",
  },
  {
    id: "fdg-002",
    projectId: "proj-001",
    assetId: "ast-002",
    title: "Insecure Cookie Flags",
    category: "Authentication",
    severity: "High",
    confidence: "High",
    blastRadius: "Global",
    status: "Confirmed",
    description: "Authentication cookies are missing the Secure and HttpOnly flags.",
    evidenceIds: ["evd-002"],
    remediationTaskIds: ["rem-002"],
    standardMappingIds: ["std-003"],
    createdAt: "2023-10-26",
  },
];

const evidences: Evidence[] = [
  {
    id: "evd-001",
    findingId: "fdg-001",
    source: "Passive Scan",
    detail: "Response headers do not contain Strict-Transport-Security.",
    timestamp: "2023-10-25T10:00:00Z",
  },
  {
    id: "evd-002",
    findingId: "fdg-002",
    source: "Passive Scan",
    detail: "Set-Cookie header observed without HttpOnly flag on /auth endpoint.",
    timestamp: "2023-10-26T11:00:00Z",
  },
];

const events: Event[] = [
  {
    id: "evt-001",
    projectId: "proj-001",
    eventType: "Login Attempt",
    timestamp: "2023-10-26T09:00:00Z",
    user: "admin",
    ip: "192.168.1.100",
    country: "US",
    device: "Desktop Safari",
    endpoint: "/auth/login",
    severity: "Low",
    riskScore: 10,
    isSynthetic: false,
  },
  {
    id: "evt-002",
    projectId: "proj-001",
    eventType: "Failed Login Spike",
    timestamp: "2023-10-26T09:15:00Z",
    user: "unknown",
    ip: "10.0.0.55",
    country: "RU",
    device: "Curl",
    endpoint: "/auth/login",
    severity: "High",
    riskScore: 85,
    isSynthetic: true,
    scenarioId: "failed_login_spike",
  },
];

const graphNodes: GraphNode[] = [
  { id: "gn-001", projectId: "proj-001", label: "admin", type: "user", risk: "Low" },
  { id: "gn-002", projectId: "proj-001", label: "192.168.1.100", type: "ip_address", risk: "Low" },
  { id: "gn-003", projectId: "proj-001", label: "Main Website", type: "asset", risk: "Medium", relatedFindingId: "fdg-001" },
];

const graphEdges: GraphEdge[] = [
  { id: "ge-001", projectId: "proj-001", from: "gn-001", to: "gn-002", relation: "logged_in_from" },
  { id: "ge-002", projectId: "proj-001", from: "gn-001", to: "gn-003", relation: "accessed" },
];

const remediationTasks: RemediationTask[] = [
  {
    id: "rem-001",
    projectId: "proj-001",
    findingId: "fdg-001",
    title: "Configure web server to emit HSTS headers",
    status: "open",
    priority: "Medium",
  },
  {
    id: "rem-002",
    projectId: "proj-001",
    findingId: "fdg-002",
    title: "Set Secure and HttpOnly flags on session cookies",
    status: "in_progress",
    priority: "High",
  },
];

const standardMappings: StandardMapping[] = [
  {
    id: "std-001",
    findingId: "fdg-001",
    framework: "OWASP",
    control: "A05:2021-Security Misconfiguration",
    description: "Ensure security headers are properly implemented.",
  },
  {
    id: "std-002",
    findingId: "fdg-001",
    framework: "NIST CSF",
    control: "PR.PT-4",
    description: "Communications and control networks are protected.",
  },
  {
    id: "std-003",
    findingId: "fdg-002",
    framework: "OWASP",
    control: "A07:2021-Identification and Authentication Failures",
    description: "Implement secure session management.",
  },
];

const reports: Report[] = [
  {
    id: "rep-001",
    projectId: "proj-001",
    title: "October Security Assessment",
    type: "Technical Report",
    createdAt: "2023-10-31",
    summary: "Found 2 open vulnerabilities. Overall posture score is 76. Remediation is in progress for critical items.",
  }
];

const usageLimit: UsageLimit = {
  userId: "usr-001",
  projectUsed: 3,
  projectLimit: 5,
  tokenUsed: 12400,
  tokenLimit: 50000,
  planName: "Free Student",
};

const detectionRules: DetectionRule[] = [
  { id: "dr-001", name: "Failed Login Spike", description: "Detects more than 50 failed logins in 5 minutes.", enabled: true, severity: "High" },
  { id: "dr-002", name: "Impossible Travel", description: "Detects logins from geographically distant locations in a short timeframe.", enabled: true, severity: "High" },
];

// Helper Functions
export const getProjects = () => projects;
export const getProjectById = (id: string) => projects.find((p) => p.id === id);
export const getAssetsByProjectId = (projectId: string) => assets.filter((a) => a.projectId === projectId);
export const getFindingsByProjectId = (projectId: string) => findings.filter((f) => f.projectId === projectId);
export const getFindingById = (findingId: string) => findings.find((f) => f.id === findingId);
export const getEvidencesByFindingId = (findingId: string) => evidences.filter((e) => e.findingId === findingId);
export const getEventsByProjectId = (projectId: string) => events.filter((e) => e.projectId === projectId);
export const getGraphNodesByProjectId = (projectId: string) => graphNodes.filter((n) => n.projectId === projectId);
export const getGraphEdgesByProjectId = (projectId: string) => graphEdges.filter((e) => e.projectId === projectId);
export const getRemediationTasksByProjectId = (projectId: string) => remediationTasks.filter((r) => r.projectId === projectId);
export const getRemediationTasksByFindingId = (findingId: string) => remediationTasks.filter((r) => r.findingId === findingId);
export const getStandardMappingsByFindingId = (findingId: string) => standardMappings.filter((s) => s.findingId === findingId);
export const getReportsByProjectId = (projectId: string) => reports.filter((r) => r.projectId === projectId);
export const getUsageLimit = () => usageLimit;
export const getDetectionRules = () => detectionRules;
