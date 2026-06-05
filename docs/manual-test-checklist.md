# ThreatLens Manual Test Checklist

Use this checklist to perform regression testing before deploying or demonstrating ThreatLens.

## 1. Authentication & Routing
- [ ] **Unauthenticated Access**: Navigate to `http://localhost:3000/dashboard` without logging in. Verify redirect to `/login`.
- [ ] **Login Success**: Log in with valid credentials (`demo@threatlens.local` / `password123`). Verify redirect to `/dashboard`.
- [ ] **Logout**: Click logout from the user menu. Verify redirect to `/login` and cookies are cleared.

## 2. Project Ownership & Isolation
- [ ] **Project Listing**: Verify the `/projects` page only shows projects owned by the logged-in user.
- [ ] **Cross-Tenant Access**: Attempt to navigate to a project ID belonging to another user. Verify a 404 or access denied message.
- [ ] **Asset Isolation**: Attempt to fetch assets for another user's project via direct API call. Verify 404/403.

## 3. Asset Management & Checks
- [ ] **Add Asset**: Create a new asset in a project.
- [ ] **Confirm Ownership**: Click "Confirm Ownership" and verify the status changes to Confirmed.
- [ ] **Passive Check**: Run the passive check on a confirmed asset. Verify it completes and generates findings.

## 4. Scan History & Findings
- [ ] **Scan Listing**: Verify scan records are created after running passive checks.
- [ ] **Finding Generation**: Verify findings are visible under the project findings tab.
- [ ] **Finding Details**: Click a finding and verify `severity`, `confidence`, `blastRadius`, and `evidence` are correctly populated.

## 5. Advanced Analysis
- [ ] **Synthetic Lab**: Generate a synthetic event in the Lab. Verify new logs appear.
- [ ] **AI Investigation**: Request an AI summary. Verify it generates text without offensive payload recommendations.
- [ ] **Remediation**: Toggle remediation tasks and verify their state persists.

## 6. Standards & Reports
- [ ] **Standards Mapping**: Verify the Standards page groups findings by frameworks (e.g., OWASP, CWE).
- [ ] **Report Generation**: Generate a PDF/Markdown report. Verify it contains the executive summary, scan history, and standards mapping disclaimer.

## 7. Admin Privileges
- [ ] **Regular User Restriction**: As `demo@threatlens.local`, navigate to `/settings`. Verify Standards and Detection Rules tabs show "Only administrators can manage".
- [ ] **Admin Access**: Log in as `admin@threatlens.local`. Navigate to `/settings`.
- [ ] **Detection Rules**: Verify admins can toggle and edit threshold JSONs.
- [ ] **Standards Import**: Verify admins can import JSON standards and activate specific framework versions.
