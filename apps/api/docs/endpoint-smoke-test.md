# Endpoint Smoke Test

This document lists the core endpoints, their purpose, and expected response shape.

## Health
- **GET /health**
  - Expected: `{"status": "ok"}`

## Auth
- **POST /auth/register**
- **POST /auth/login**
- **GET /auth/me**
  - Expected: `{"id": "usr-001", "name": "Investigator Admin", "role": "admin"}`

## Projects
- **GET /projects**
  - Expected: Array of projects.
- **GET /projects/{project_id}**
  - Expected: `{"id": "proj-001", "name": "Demo Web App", "environment": "Staging", "risk_level": "High", "posture_score": 76}`
- **POST /projects**
- **PUT /projects/{project_id}**
- **DELETE /projects/{project_id}**

## Assets
- **GET /projects/{project_id}/assets**
  - Expected: Array of assets scoped to the project.
- **POST /projects/{project_id}/assets**
- **PUT /assets/{asset_id}**
- **DELETE /assets/{asset_id}**

## Passive Check
- **POST /projects/{project_id}/assets/{asset_id}/passive-check**
  - Expected: `{"scan": {...}, "findings": [...]}`

## Findings
- **GET /projects/{project_id}/findings**
  - Expected: Array of findings scoped to the project. Includes fields like `blast_radius`, `severity`.
- **GET /projects/{project_id}/findings/{finding_id}**
  - Expected: Single finding object. Return 404 if finding_id does not belong to project_id.

## Timeline
- **GET /projects/{project_id}/timeline**
  - Expected: Array of events sorted by timestamp descending. Includes `is_synthetic` and `risk_score`.

## Graph
- **GET /projects/{project_id}/graph**
  - Expected: `{"nodes": [...], "edges": [...]}` scoped to project.

## Lab
- **POST /projects/{project_id}/lab/generate**
  - Body: `{"scenario_id": "failed_login_spike"}`
  - Expected: Creates synthetic events and returns them.
- **GET /projects/{project_id}/events**
  - Expected: Array of synthetic and real events scoped to project.

## Remediation
- **GET /projects/{project_id}/remediation**
  - Expected: Array of remediation tasks.
- **PUT /projects/{project_id}/remediation/{task_id}**
  - Expected: Updates task status. Returns 404 if task_id does not belong to project_id.

## Standards
- **GET /projects/{project_id}/standards**
  - Expected: Array of standard mappings based on findings in the project.

## Reports
- **GET /projects/{project_id}/reports**
  - Expected: Array of generated reports.
- **POST /projects/{project_id}/reports**

## Settings
- **GET /settings/usage**
- **GET /settings/detection-rules**
- **PUT /settings/detection-rules/{rule_id}**
