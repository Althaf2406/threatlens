# ThreatLens Demo Script

**Duration**: 7–10 Minutes
**Goal**: Showcase the defensive capabilities, standard mappings, and AI explanations of ThreatLens while emphasizing its non-offensive nature.

---

## Part 1: The Practitioner's Workflow (Demo User)
*Narrator: "We'll start by logging in as a security practitioner handling a specific application environment."*

1. **Login**
   - Navigate to `/login`.
   - Use `demo@threatlens.local` / `password123`.

2. **Dashboard Overview**
   - Show the summary of active projects and tokens used.
   - Click on the existing project: "Demo Web App".

3. **Asset Management & Verification**
   - Navigate to the **Assets** tab.
   - Explain that ThreatLens requires explicit ownership before it performs any analysis.
   - Add a new asset (e.g., `api.example.com`).
   - Click "Confirm Ownership" to simulate the ownership verification process (e.g., via DNS TXT or meta tag).

4. **Passive Security Check**
   - Once ownership is confirmed, click "Run Passive Check".
   - *Narrator: "We perform purely defensive checks—analyzing headers, SSL configurations, and exposed metadata without firing offensive payloads or brute-forcing."*

5. **Scan History & Findings**
   - Navigate to the **Scans** tab. Briefly show how before/after scans can be compared to track security degradation or improvement over time.
   - Navigate to the **Findings** tab.

6. **Finding Details & Evidence-First Approach**
   - Click into a specific finding (e.g., "Missing Security Headers").
   - Highlight the **Severity**, **Confidence**, and **Blast Radius**.
   - Scroll to **Evidence & Telemetry**.
   - *Narrator: "Every finding is rooted in raw telemetry or logs. We don't guess; we show exactly what triggered the rule."*

7. **Context & Explainability**
   - Navigate to **Timeline** and **Graph** to show the chronological and structural context of the findings across the project's assets.

## Part 2: Advanced Analysis & Reporting
*Narrator: "To scale our analysis, we leverage synthetic logs and AI to build actionable remediation plans."*

8. **Synthetic Lab (Optional)**
   - Navigate to **Lab**. Generate a scenario to ingest mock logs.
   - Explain how this helps train practitioners without using real-world sensitive data.

9. **AI Investigator**
   - Navigate to the **AI** tab. Generate a new summary focusing on "Configuration Issues".
   - *Narrator: "The AI acts defensively. It doesn't overclaim, it highlights when evidence is insufficient, and it absolutely never suggests or provides exploit code."*

10. **Remediation & Standards Mapping**
    - Navigate to **Remediation** to show the checklist.
    - Navigate to **Standards Mapping**.
    - *Narrator: "Findings are mapped against frameworks like OWASP and NIST. Notice the clear disclaimer: this is for internal guidance, not formal compliance."*

11. **Reports**
    - Navigate to **Reports**. Generate a final executive report incorporating scan history, standard mappings, and the AI summary.

## Part 3: Administrative Controls (Admin User)
*Narrator: "Finally, let's look at the guardrails and configuration from the system administrator's perspective."*

12. **Admin Login**
    - Log out and log back in as `admin@threatlens.local` / `admin123`.
    - Navigate to **Settings**.

13. **Pricing & Usage Guardrails**
    - Show the **Plans & Usage** tab. Explain the Free Student plan and its limits (3 projects, 1000 tokens).
    - Show the **AI Provider & Guardrails** tab.
    - Explain the local/template AI mode: "This prevents accidental API costs by defaulting to safe, deterministic local generation."
    - Mention the cost preview feature that appears before generating AI summaries or reports.

14. **Detection Rules Management**
    - Show the **Detection Rules** tab. Explain how admins can tune thresholds to reduce false positives globally.

15. **Security Standards Management**
    - Show the **Security Standards** tab.
    - Demonstrate how new standards can be imported via JSON and specific versions (e.g., OWASP 2021) can be activated or deactivated.

16. **Closing Statement**
    - *Narrator: "ThreatLens delivers high-context security analysis through strict, defensive-only constraints, empowering teams to fix vulnerabilities without the risks associated with automated offensive tools."*
