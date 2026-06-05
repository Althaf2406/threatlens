# ThreatLens — AI Security Investigator Dashboard

## Short Description
ThreatLens adalah web dashboard defensive-only untuk membantu developer, mahasiswa IT, dan tim kecil menganalisis security posture aplikasi milik sendiri, staging, demo, atau lab environment.

## Key Features
- Authentication and role-based access
- Project-scoped workspace
- Asset management with ownership confirmation
- Passive platform checker
- Synthetic security lab
- Findings with evidence, severity, confidence, and blast radius
- Incident timeline
- Attack graph
- AI Investigation Summary
- Remediation checklist
- Standards mapping and standards versioning
- Report generation
- Scan history and before/after comparison
- Detection rule management
- Admin settings

## Safety Boundary
ThreatLens dirancang dengan sangat hati-hati sebagai alat murni defensif:
- **TIDAK** menjalankan exploit.
- **TIDAK** melakukan brute force.
- **TIDAK** mencuri credential.
- **TIDAK** melakukan bypass authentication.
- **TIDAK** menghasilkan malicious payload.
- Hanya melakukan **defensive analysis** dan **synthetic simulation**.

## Tech Stack
**Frontend:**
- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Backend:**
- FastAPI
- SQLAlchemy
- SQLite (local development)
- JWT HTTP-only cookie authentication

## Folder Structure
- `apps/web`: Source code untuk frontend Next.js.
- `apps/api`: Source code untuk backend FastAPI.
- `docs/`: Dokumentasi teknis, setup, pengujian, dan presentasi.

## Quick Start
Lihat panduan lengkap untuk menjalankan project ini di: [Local Setup Guide](docs/local-setup.md).

## Demo Accounts
- **Demo User:** `demo@threatlens.local` / `password123`
- **Admin User:** `admin@threatlens.local` / `admin123`

## Important Docs
- [SRS Traceability Matrix](docs/srs-traceability-matrix.md)
- [API Endpoints](docs/api-endpoints.md)
- [Local Setup](docs/local-setup.md)
- [Demo Script](docs/demo-script.md)
- [Manual Test Checklist](docs/manual-test-checklist.md)
- [Deployment Preparation](docs/deployment-preparation.md)

## Current Status
**Status:** MVP ready for presentation and initial deployment preparation.
