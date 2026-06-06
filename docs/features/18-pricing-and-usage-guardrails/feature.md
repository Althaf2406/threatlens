# Feature 18: Pricing & Usage Guardrails

## Overview
ThreatLens is designed with a student-first approach. To ensure the platform remains accessible and safe for MVP workflows, we have introduced a Pricing & Usage Guardrail system. This system enforces fair usage across Free, Pro, and Admin plans. It implements quotas on projects and AI tokens, ensuring users do not accidentally incur costs or exceed budget limits when exploring the dashboard.

## User Flow
1. **Settings / Plans & Usage:**
   Users navigate to `/settings` and view their current active plan, tracking their project limit and token usage dynamically.
2. **Project Creation Limit:**
   When attempting to create a project, the system verifies the user's plan limits. A "Free Student" plan is capped at 3 projects.
3. **AI Summaries / Report Cost Preview:**
   When a user clicks "Generate AI Summary" or "Generate Report," an interactive **Cost Preview Dialog** opens. It summarizes:
   - Current AI Provider Mode
   - Tokens Required (100 for findings, 250 for project summaries, 500 for reports)
   - Remaining Tokens Before/After
4. **Token Exhaustion:**
   If the user has insufficient tokens, the confirm button is disabled, and a clear warning prompts them to upgrade their plan or reduce their scope.
5. **AI Mode Selection:**
   Users can choose their backend AI provider in Settings. The default is `template_local`, guaranteeing free, deterministic behavior. Users can optionally configure external APIs (e.g., OpenAI, Gemini, Groq) if they have custom keys and budgets, or local inferences like Ollama.

## Pricing Plan Model
- **Free Student Plan**: Recommended for students building and demoing. Capped at 3 projects and 1000 monthly AI tokens.
- **Pro Plan**: Optional upgrade later. Supports 5 projects and 10000 tokens.
- **Admin Plan**: Custom system plan with higher limits.

## Token Usage Model
Token costs are standardized across generation workflows to simplify quota tracking:
- **Finding Summary**: 100 Tokens
- **Project Summary**: 250 Tokens
- **Report Generation**: 500 Tokens

## AI Mode Settings
The **AI Mode Fallback** safely manages the usage of AI across the system:
- **Local Template Mode**: "Free, deterministic, and safe for MVP demos. No external AI API is called." (Default)
- **Paid API Mode**: "Optional. Use only if you have configured a provider key and budget limit."
- If an API key is missing or fails, the app falls back or displays a clear UI warning instead of crashing.

## Backend Endpoints
- `GET /api/v1/settings/usage` - Retrieves the user's current token usage, limits, and active AI mode.
- `GET /api/v1/settings/plans` - Lists the pricing details for Free, Pro, and Admin tiers.
- `PUT /api/v1/settings/ai-mode` - Updates the user's configured AI provider.
- `POST /api/v1/projects/{project_id}/ai-summaries` - Validates token quota, generates summary, deducts tokens, and saves to database.
- `POST /api/v1/projects/{project_id}/reports` - Validates quota, generates full defensive report with standard mappings, deducts tokens, and saves report history.

## Frontend Components
- `SettingsPage` (`/app/settings/page.tsx`): Houses the Plans & Usage and AI Guardrails tabs.
- `ProjectShell` & Dashboard Widgets: Display dynamic token progress bars.
- `Cost Preview Dialog`: Embedded within Report and Finding Generation flows.
- `api.ts`: API integrations mapping snake_case responses to camelCase for the UI.

## Security & Limitations
- **No API Keys in Frontend**: Provider keys are managed strictly via environment variables (`.env.local`). They are never exposed to the client bundle.
- **Defensive AI Disclaimer**: All generated content explicitly includes:
  *"This summary is defensive-only. No offensive payloads, credentials, exploit instructions, brute force steps, or authentication bypass guidance are generated. This report is for remediation and learning, not formal compliance certification."*
- **Token Usage Enforcement**: Frontend buttons are disabled if tokens are insufficient, but backend middleware ultimately enforces project and token limits safely.
- **Cached Summaries**: Reloading previously generated summaries does not trigger a re-generation, preventing double token deduction.

## Future Improvements
- Expand AI Mode options with direct integrations via secure secret vaults.
- Subscription billing integration via Stripe.
- Implement granular token accounting tracking real LLM usage.
