# Final Submission Checklist

Gunakan checklist ini untuk memverifikasi bahwa project sudah utuh, rapi, dan siap dikumpulkan atau dipresentasikan.

## A. Codebase
- [x] Frontend builds successfully (`pnpm build:memory`).
- [x] Backend runs successfully (`uvicorn`).
- [x] Database seed script works (`python app/seed.py`).
- [x] No TypeScript errors in active components.
- [x] No Python import errors or broken dependencies.
- [x] No dead global routes (e.g., old `/findings` or `/timeline`).
- [x] No hardcoded secrets (JWT secret reads from `.env`).
- [x] `.env` dan `.env.local` diabaikan oleh Git.
- [x] Local databases (`*.sqlite3`, `*.db`) diabaikan oleh Git.

## B. Feature Coverage
- [x] Authentication & Authorization (HTTP-Only Cookie)
- [x] Project Scoping & Ownership Validation
- [x] Asset Management & Confirmation
- [x] Passive Checker (Headers, DNS Simulation)
- [x] Security Findings (Severity, Blast Radius)
- [x] Evidence & Telemetry Links
- [x] Incident Timeline
- [x] Attack Surface Graph
- [x] Synthetic Lab & Log Ingestion
- [x] AI Investigation Summary
- [x] Remediation Action Plan
- [x] Standards Mapping (OWASP, NIST)
- [x] Reporting System (Executive & Technical)
- [x] Scan History & Comparisons
- [x] Detection Rules Management (Admin)
- [x] Security Standards Data Management (Admin)

## C. Security Boundary (Defensive-Only)
- [x] NO offensive exploits.
- [x] NO brute force capabilities.
- [x] NO credential theft.
- [x] NO bypass authentication techniques.
- [x] NO generation of malicious payloads.
- [x] All claims are strictly **evidence-first**.

## D. Documentation
- [x] README.md (Landing Page)
- [x] Setup Guide (`docs/local-setup.md`)
- [x] API Documentation (`docs/api-endpoints.md`)
- [x] Demo Script (`docs/demo-script.md`)
- [x] SRS Traceability Matrix (`docs/srs-traceability-matrix.md`)
- [x] Deployment Preparation (`docs/deployment-preparation.md`)
- [x] Manual Test Checklist (`docs/manual-test-checklist.md`)

## E. Demo Readiness
- [x] Demo account works (`demo@threatlens.local`).
- [x] Admin account works (`admin@threatlens.local`).
- [x] Main demo route (end-to-end workflow) works flawlessly.
- [x] Report generation operates smoothly.
- [x] AI summary outputs defensively-worded explanations.
- [x] Scan comparison successfully identifies changes.
