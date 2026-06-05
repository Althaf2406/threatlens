# ThreatLens API Documentation

**Base URL**: `/api/v1`
**Authentication**: JWT via `threatlens_access_token` HttpOnly cookie.

## 1. Authentication
- `POST /auth/register`: Register a new user. (Public)
- `POST /auth/login`: Authenticate and set HttpOnly cookie. (Public)
- `POST /auth/logout`: Clear authentication cookie. (Protected)
- `GET /auth/me`: Retrieve current user profile and role. (Protected)

## 2. Projects
- `GET /projects/`: List all projects owned by the current user. (Protected)
- `GET /projects/{project_id}`: Get project details. (Protected, Owner)
- `POST /projects/`: Create a new project workspace. (Protected)
  - *Payload*: `{"name": "...", "description": "...", "environment": "..."}`
- `PUT /projects/{project_id}`: Update project metadata. (Protected, Owner)
- `DELETE /projects/{project_id}`: Delete a project. (Protected, Owner)

## 3. Assets
- `GET /projects/{project_id}/assets`: List assets in a project. (Protected, Owner)
- `POST /projects/{project_id}/assets`: Add a new asset. (Protected, Owner)
- `POST /projects/{project_id}/assets/{asset_id}/confirm-ownership`: Confirm authorization to analyze asset. (Protected, Owner)
- `POST /projects/{project_id}/assets/{asset_id}/passive-check`: Run a non-intrusive metadata check. (Protected, Owner)

## 4. Findings
- `GET /projects/{project_id}/findings`: List all security findings for a project. (Protected, Owner)
- `GET /projects/{project_id}/findings/{finding_id}`: Get detailed finding info including evidence and standard mappings. (Protected, Owner)

## 5. Timeline & Graph
- `GET /projects/{project_id}/timeline`: Retrieve chronological security events. (Protected, Owner)
- `GET /projects/{project_id}/graph`: Retrieve nodes and edges for the attack surface graph. (Protected, Owner)

## 6. Synthetic Lab
- `POST /projects/{project_id}/lab/generate`: Trigger mock security events for educational scenarios. (Protected, Owner)
  - *Payload*: `{"scenario_id": "..."}`

## 7. AI Investigator
- `GET /projects/{project_id}/ai-summaries`: List AI investigation summaries. (Protected, Owner)
- `POST /projects/{project_id}/ai-summaries`: Generate a new LLM-based summary of current findings. (Protected, Owner)
  - *Payload*: `{"focus_area": "..."}`

## 8. Remediation
- `GET /projects/{project_id}/remediation`: Retrieve remediation checklist. (Protected, Owner)
- `PUT /projects/{project_id}/remediation/{task_id}`: Update task status. (Protected, Owner)

## 9. Standards Mapping
- `GET /projects/{project_id}/standards`: Retrieve project-wide security standards mappings grouped by framework. (Protected, Owner)

## 10. Reports & Scans
- `GET /projects/{project_id}/scans`: Retrieve scan history. (Protected, Owner)
- `POST /projects/{project_id}/scans/compare`: Compare two scan baselines. (Protected, Owner)
- `GET /projects/{project_id}/reports`: List generated reports. (Protected, Owner)
- `POST /projects/{project_id}/reports`: Generate a new executive or technical report. (Protected, Owner)

## 11. Admin Settings
*Requires `admin` or `system_admin` role.*
- `GET /settings/detection-rules`: List all engine rules. (Admin)
- `PUT /settings/detection-rules/{rule_id}`: Update rule status or threshold. (Admin)
- `GET /settings/security-standards`: List global security frameworks and controls. (Admin)
- `POST /settings/security-standards/import`: Import a JSON schema of standard frameworks. (Admin)
- `POST /settings/security-standards/{standard_id}/activate`: Toggle standard version activation. (Admin)
