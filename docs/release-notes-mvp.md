# ThreatLens Release Notes

## Version: MVP 1.0
**Date:** June 2026

We are incredibly excited to announce the Minimum Viable Product (MVP) release of ThreatLens! ThreatLens was built with a singular mission: to provide developers and IT students with a defensive-only, evidence-based AI Security Investigator Dashboard to understand their application's security posture.

### 🎉 Completed Features
- **Project-Scoped Workspaces**: Isolate your security analysis into distinct projects with strict ownership controls.
- **Asset Management**: Register web assets, confirm ownership, and maintain an inventory of what needs to be protected.
- **Passive Checker**: A non-intrusive metadata analysis engine that simulates data gathering without firing exploits.
- **Synthetic Lab**: Generate mock security logs to practice incident response in a safe, controlled environment.
- **Evidence-First Findings**: Every security finding requires raw telemetry evidence, severity, confidence, and blast radius.
- **Incident Timeline & Attack Graph**: Visualize the chronological and structural impact of vulnerabilities across your assets.
- **AI Investigator**: A defensive AI summary generator that contextualizes findings without suggesting offensive exploits.
- **Standards Mapping**: Built-in mapping to recognized frameworks (like OWASP) with versioning support.
- **Report Generation**: Export your findings and scan history into structured executive and technical reports.

### ⚠️ Known Limitations
As an MVP, ThreatLens has some architectural boundaries designed for safety and speed of development:
- **Local SQLite Database**: The backend currently defaults to SQLite. This is strictly for local demonstration and is **not scalable** for production deployment.
- **Simulated Passive Checker**: The current passive checker engine relies on simulated and rudimentary metadata gathering. It does not yet perform deep external reconnaissance.
- **Template-Based AI**: The "AI Summary" currently uses localized, templated generation suitable for demonstration. True integration with external LLMs (e.g., OpenAI, Gemini) is planned for the next iteration.
- **Sample Standards Data**: The pre-loaded standards data represents a structural sample of OWASP and NIST. Full database implementations must be imported manually via JSON.
- **Production Requirements**: Deployment to production will require replacing SQLite, enforcing HTTPS with `COOKIE_SECURE=true`, and securely managing the secret keys.

### 🛠️ Local Development Notes
To test the MVP locally, please refer to the [Local Setup Guide](local-setup.md). Default demo accounts are provided:
- Practitioner: `demo@threatlens.local`
- Administrator: `admin@threatlens.local`

### 🚀 Future Improvements
- Migration to managed PostgreSQL.
- Integration with external LLM providers for deep, context-aware remediation advice.
- Extended passive analysis modules for Cloud Configuration Checks (AWS/GCP).
- Real-time Webhook integrations for CI/CD pipelines.

Thank you for exploring ThreatLens 1.0!
