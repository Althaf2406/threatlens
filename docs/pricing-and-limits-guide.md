# ThreatLens: In-Depth Research Guide for Tokens, Projects, and Plans

This document serves as a contextual guide for AI models (such as ChatGPT) to perform research, business analysis, and architectural design regarding ThreatLens' monetization, plans (Free vs. Pro), and token economy.

---

## 1. System Context & Concept
ThreatLens is an **evidence-based, defensive-only AI Security Investigator** designed for developers and IT teams to monitor, audit, and improve their application security posture. 

- **Defensive-Only**: The platform does not execute exploits, bypass authentication, perform brute force, or run active payloads. It is strictly for compliance check, passive audits, and evidence gathering.
- **Evidence-Based**: No security finding is reported without concrete telemetry (logs, network headers, config files) attached as **Evidence**.
- **Project-Scoped**: Resources are fully isolated within workspaces called **Projects**.

---

## 2. Plan Limits & Database Schema
Plan configurations are enforced at the database level in the `users` table:

| Field in DB | Type | Default (Free) | Pro Plan (Demo User) | Admin Plan |
| :--- | :--- | :--- | :--- | :--- |
| `plan_name` | String | `"free"` | `"pro"` | `"pro"` |
| `project_limit` | Integer | `3` | `5` | `10` |
| `token_limit` | Integer | `1000` | `10000` | `50000` |

### Database Seed Blueprint (SQLite)
```python
# From apps/api/seed.py
demo_user = User(
    id="usr-demo",
    name="Demo User",
    email="demo@threatlens.local",
    hashed_password=get_password_hash("password123"),
    role="user",
    plan_name="pro",
    project_limit=5,
    token_limit=10000
)
```

---

## 3. Token Economy & AI Investigator
In ThreatLens, **Tokens** represent the computation quota allocated for generating **AI Investigator Summaries**.

### How Tokens Work:
1. **Mock Processing Quota**: In the MVP, AI investigator summaries are template-based. However, each summary generation consumes tokens to simulate querying an external LLM (e.g., GPT-4 or Gemini Pro).
2. **Quota Aggregation**: The dashboard and sidebar query user limits and summarize token usage across all projects:
   $$\text{Total Tokens Used} = \sum_{p \in \text{Projects}} p.\text{tokenUsed}$$
3. **Usage Enforcement**: If a user runs out of tokens, AI investigation capabilities are temporarily suspended until the usage is reset or the user upgrades to a higher plan.

---

## 4. Feature Comparison: Free vs. Pro vs. Admin

### **Free Student Plan (Default Register)**
- **Projects**: Max 3 active projects.
- **Token Budget**: 1,000 tokens (suitable for small web apps and testing).
- **Core Security Modules**: Passive Checker (non-intrusive scans), Findings List, and Evidence viewer.
- **Support**: Self-hosted SQLite local file.

### **Pro Plan (Premium Upgrade)**
- **Projects**: Max 5 active projects.
- **Token Budget**: 10,000 tokens (supports dense telemetry scans).
- **Compliance Integration**: Advanced Standards Mapping (OWASP Top 10, CWE-1004 context mapping).
- **AI Investigator**: Finding-specific summaries + global project health briefs.
- **Target Audience**: Single practitioners, freelancers, and small security teams auditing active staging environments.

### **System Admin / Enterprise Plan**
- **Projects**: Max 10+ active projects.
- **Token Budget**: 50,000+ tokens.
- **Full Capabilities**: Custom Detection Rules Engine access (creating, enabling, disabling specific security checks), manual compliance control configurations.
- **Target Audience**: Enterprise security managers, systems administrators.

---

## 5. Commercial Value Proposition (Upgrade Upgrades)
When a user pays to upgrade from **Free** to **Pro** or **Enterprise**, they unlock:
1. **Capacity Expansion**: Higher project limits to manage large-scale multi-environment architectures (Local, Staging, Demo, Production).
2. **AI Computational Bandwidth**: Larger token pools to generate comprehensive executive and technical reports with rich, compliance-mapped contexts.
3. **Control over Detection Rules**: Ability to disable false positives or tune rules (CORS, HSTS header requirements, Impossible Travel thresholds) in the administrative engine.
4. **Production Readiness**: Seamless transition from self-contained local SQLite instances to robust PostgreSQL databases, complete with secure JWT HttpOnly cookie management.

---

## 6. ChatGPT Research Prompt Template
*Copy and paste the prompt below into ChatGPT to start a deep research session:*

```text
You are a senior product strategist and security architect analyzing "ThreatLens", a defensive, evidence-based AI Security Investigator dashboard. 

Here is the context of the platform's pricing structure and plans:
- Free: 3 projects, 1,000 tokens.
- Pro: 5 projects, 10,000 tokens.
- Admin/Enterprise: 10+ projects, 50,000+ tokens.
- Tokens represent the simulated quota cost consumed when running the AI Investigator tool to summarize vulnerabilities based on raw telemetry evidence.

Tasks:
1. Design a commercialization and growth strategy for ThreatLens. How can we optimize the token pricing models (e.g., pay-as-you-go vs. monthly subscription tiers)?
2. Propose technical mechanisms to enforce project and token limits dynamically in a FastAPI/SQLAlchemy backend and Next.js frontend.
3. Suggest 3 premium features that are highly appealing to Pro users (e.g., CI/CD plugin check integrations, automated mitigation patch suggestions, third-party SIEM webhooks) and how they should be priced.
4. Draft a marketing pitch targeting tech leads explaining why they should upgrade from Free to Pro.
```
