export const PLANS = {
  FREE_PLAN: {
    id: "free",
    name: "Free Student",
    projectLimit: 3,
    tokenLimit: 1000,
    price: "Rp0",
    bestFor: "Student MVP, local demo, portfolio",
    features: [
      "3 projects",
      "1,000 AI tokens",
      "Passive checker",
      "Findings and evidence",
      "Remediation checklist",
      "Standards mapping",
      "Template-based AI summary",
      "Local-first demo"
    ]
  },
  PRO_PLAN: {
    id: "pro",
    name: "Pro",
    projectLimit: 5,
    tokenLimit: 10000,
    price: "Optional / Later",
    bestFor: "Polished demo, advanced report generation",
    features: [
      "5 projects",
      "10,000 AI tokens",
      "Project-level AI summaries",
      "Advanced reports",
      "Before/after scan comparison",
      "More report quota"
    ]
  },
  ADMIN_PLAN: {
    id: "admin",
    name: "Admin",
    projectLimit: 10,
    tokenLimit: 50000,
    price: "Custom",
    bestFor: "System administrator, lecturer demo, detection rule management",
    features: [
      "Manage users",
      "Manage detection rules",
      "Manage standards data",
      "System-wide scan visibility"
    ]
  }
};
