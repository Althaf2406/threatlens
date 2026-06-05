# Software Requirements Specification (SRS) Traceability Matrix

This matrix maps the core functional and non-functional requirements of ThreatLens to their corresponding frontend routes, backend endpoints, and current implementation status.

| SRS Area | Requirement | Implemented Feature | Frontend Route | Backend Endpoint | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **User Management** | Authentication & Session | Login, Registration, JWT HTTP-Only Cookies | `/login`, `/register` | `/api/v1/auth/*` | Done | Uses HttpOnly cookie, robust against XSS. |
| **User Management** | Role-based Access | Admin vs Regular User separation | `/settings` | Middleware + `current_user.role` | Done | Admin routes protected at backend. |
| **Project Management** | Workspace Isolation | Scoped projects, Ownership verification | `/projects/*` | `dependencies/ownership.py` | Done | 404 thrown for unauthorized cross-tenant access. |
| **Project Management** | Project Creation | Create new workspaces and environments | `/projects/new` | `POST /api/v1/projects` | Done | Successfully tied to frontend form. |
| **Asset Management** | Inventory | Add, edit, list web/cloud assets | `/projects/[id]/assets` | `/api/v1/projects/{id}/assets` | Done | Ownership validation implemented. |
| **Passive Checker** | Non-intrusive Analysis | Passive platform verification (header/DNS check) | UI Button on Asset | `POST .../assets/{id}/passive-check` | Done | Simulated defensive data gathering. |
| **Log Ingestion** | Synthetic Lab | Mock log generation for training | `/projects/[id]/lab` | `POST /api/v1/projects/{id}/lab/generate` | Done | Generates scenario-based synthetic logs. |
| **Risk Analysis** | Findings & Evidence | Traceable findings with confidence and severity | `/projects/[id]/findings` | `GET /api/v1/projects/{id}/findings` | Done | Eagerly loads standards mappings. |
| **Incident Timeline** | Chronological View | Timeline of security events | `/projects/[id]/timeline` | `GET /api/v1/projects/{id}/timeline` | Done | Frontend timeline component implemented. |
| **Attack Graph** | Attack Surface Vis | Nodes and edges visualization | `/projects/[id]/graph` | `GET /api/v1/projects/{id}/graph` | Done | Renders D3/React-based graph. |
| **AI Investigation** | GenAI Analysis | LLM-based investigation of findings | `/projects/[id]/ai` | `POST .../ai-summaries` | Demo Mock | Synthetic summaries generated without overclaiming. |
| **Remediation** | Actionable Fixes | Remediation checklist and status tracking | `/projects/[id]/remediation` | `GET .../remediation` | Done | Toggled via frontend state. |
| **Standards Mapping** | Compliance Guidance | Map findings to OWASP, CWE, NIST | `/projects/[id]/standards` | `GET .../standards` | Done | Versioning and mapping traceability supported. |
| **Reporting** | Scan History & Reports | Compare before/after, export executive reports | `/projects/[id]/reports` | `GET .../reports` | Done | Includes disclaimer for compliance. |
| **Detection Rules** | Engine Configuration | Admin toggles for detection rules and thresholds | `/settings` | `/api/v1/settings/detection-rules` | Done | Admin-only. |
| **Security (NFR)** | Defensive Constraints | No offensive actions (exploits, brute force) allowed | N/A | Hardcoded rules in backend | Done | Strictly enforced by design and logic. |
| **Usability (NFR)** | Modern & Accessible UI | Dark theme, responsive cards, clear states | Global | N/A | Done | Tailwind CSS with consistent UI tokens. |
| **Auditability (NFR)** | Evidence-First approach | Every finding requires raw evidence or telemetry | `/projects/[id]/findings/[id]` | `Finding.evidence` | Done | Displayed in finding detail page. |

---
**Status Definition:**
- **Done**: Fully implemented and tested.
- **Partial**: Implemented but missing some edge cases.
- **Demo Mock**: Synthetic implementation suitable for demo/educational purposes.
- **Not Implemented**: Planned but not started.
