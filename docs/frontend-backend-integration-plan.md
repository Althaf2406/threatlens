# Frontend-Backend Integration Plan

This document outlines the strategy for migrating the ThreatLens frontend from `mock-data.ts` to the live FastAPI backend using `apps/web/lib/api.ts`.

## Integration Principles
1. **Iterative Migration**: Do not swap everything at once. Migrate page by page.
2. **Graceful Fallback**: Use React Suspense/Loading boundaries while waiting for API calls.
3. **Error Handling**: Use React Error Boundaries or standard UI error states if the backend is unreachable.
4. **Data Mapping**: The frontend expects camelCase or specific structures in some places. Use mapping functions in `api.ts` or directly in the components to transform backend snake_case to frontend camelCase.

## Recommended Integration Sequence

### 1. `/projects` (Project List)
- **Endpoint**: `GET /projects`
- **State Needed**: None (Server Component or simple SWR/useEffect fetching).
- **UI States**: 
  - Loading: Skeleton loader for project cards.
  - Empty: "No projects found" prompt.
  - Error: "Failed to load projects."

### 2. `/projects/[id]` (Project Overview)
- **Endpoint**: `GET /projects/{project_id}`
- **State Needed**: `projectId` from URL params.
- **UI States**: Loading spinner on overview metric cards.

### 3. `/projects/[id]/findings` (Findings List)
- **Endpoint**: `GET /projects/{project_id}/findings`
- **Mapping**: Map `severity`, `category` to the exact string matches the frontend badges expect.

### 4. `/projects/[id]/findings/[findingId]` (Finding Detail)
- **Endpoint**: `GET /projects/{project_id}/findings/{finding_id}`
- **UI States**: Return 404 (Not Found) if backend returns 404.

### 5. `/projects/[id]/lab` (Synthetic Lab)
- **Endpoints**: `POST /projects/{project_id}/lab/generate`, `GET /projects/{project_id}/events`
- **State Needed**: Form state for selected scenario.
- **Loading State**: Disable "Generate" button while POST is flight. Polling or immediate re-fetch for events table.

### 6. `/projects/[id]/timeline`
- **Endpoint**: `GET /projects/{project_id}/timeline`

### 7. `/projects/[id]/remediation`
- **Endpoints**: `GET /projects/{project_id}/remediation`, `PUT /projects/{project_id}/remediation/{task_id}`

### 8. `/projects/[id]/standards`
- **Endpoint**: `GET /projects/{project_id}/standards`

### 9. `/projects/[id]/reports`
- **Endpoints**: `GET /projects/{project_id}/reports`, `POST /projects/{project_id}/reports`

### 10. `/dashboard` (Global Overview)
- **Endpoint**: `GET /projects`, `GET /projects/{id}/findings` (Aggregate manually or create an aggregate endpoint later).

### 11. `/settings`
- **Endpoints**: `GET /settings/usage`, `GET /settings/detection-rules`

## Data Mapping Strategy
Since Python FastAPI standard defaults to `snake_case` (e.g., `project_id`, `created_at`) and JS/TS frontend typically uses `camelCase` (`projectId`, `createdAt`), we will map the responses inside `apps/web/lib/api.ts` as we integrate, rather than forcing the backend to use aliases.
