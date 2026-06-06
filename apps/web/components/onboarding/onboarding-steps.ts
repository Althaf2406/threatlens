export interface OnboardingStep {
  id: string;
  route: string; // Route layout template
  target: string; // data-tour value
  title: string;
  text: string;
  safetyBoundary?: string;
  placement?: "top" | "bottom" | "left" | "right" | "center";
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "dashboard_welcome",
    route: "/dashboard",
    target: "dashboard-overview",
    title: "Welcome to ThreatLens",
    text: "Ini adalah dashboard utama ThreatLens. Di sini kamu melihat ringkasan project, posture score, token usage, dan finding berisiko tinggi.",
    placement: "bottom",
  },
  {
    id: "project_menu",
    route: "/dashboard",
    target: "nav-projects",
    title: "Projects Menu",
    text: "ThreatLens bekerja berbasis project. Setiap aplikasi yang ingin dianalisis akan masuk ke dalam project workspace.",
    placement: "right",
  },
  {
    id: "projects_page",
    route: "/projects",
    target: "projects-list",
    title: "Project Workspace",
    text: "Di halaman ini kamu bisa melihat semua project yang kamu miliki dan membuka workspace analisis keamanan.",
    placement: "bottom",
  },
  {
    id: "create_project",
    route: "/projects",
    target: "create-project-button",
    title: "Create Project",
    text: "Klik Create Project untuk membuat workspace baru. Di MVP ini kamu juga bisa memakai project demo yang sudah tersedia.",
    placement: "left",
  },
  {
    id: "project_overview",
    route: "/projects/{projectId}",
    target: "project-overview-summary",
    title: "Project Overview",
    text: "Di dalam project, semua data seperti assets, scans, findings, timeline, graph, AI summary, remediation, dan reports akan terhubung ke project ini.",
    placement: "bottom",
  },
  {
    id: "assets_tab",
    route: "/projects/{projectId}/assets",
    target: "assets-list",
    title: "Assets Inventory",
    text: "Assets adalah website, API, repository, atau demo target yang ingin dianalisis secara defensif.",
    placement: "top",
  },
  {
    id: "add_asset",
    route: "/projects/{projectId}/assets",
    target: "add-asset-button",
    title: "Add Asset",
    text: "Tambahkan asset baru dan isi informasi seperti nama, tipe, environment, dan URL atau identifier.",
    placement: "left",
  },
  {
    id: "ownership_confirmation",
    route: "/projects/{projectId}/assets/new",
    target: "ownership-confirmation",
    title: "Ownership Confirmation",
    text: "ThreatLens hanya boleh digunakan pada asset milik sendiri, staging, demo, atau lab environment. Konfirmasi ownership wajib sebelum passive check.",
    safetyBoundary: "ThreatLens tidak menjalankan exploit, brute force, credential theft, authentication bypass, atau malicious payload. Analisis dilakukan secara defensif dan berbasis evidence.",
    placement: "top",
  },
  {
    id: "passive_check",
    route: "/projects/{projectId}/assets/{assetId}",
    target: "run-passive-check",
    title: "Passive Check",
    text: "Passive check membantu memeriksa konfigurasi dasar secara aman, tanpa exploit, brute force, credential theft, atau bypass.",
    safetyBoundary: "ThreatLens tidak menjalankan exploit, brute force, credential theft, authentication bypass, atau malicious payload. Analisis dilakukan secara defensif dan berbasis evidence.",
    placement: "left",
  },
  {
    id: "findings",
    route: "/projects/{projectId}/findings",
    target: "findings-list",
    title: "Findings List",
    text: "Findings menampilkan risiko yang ditemukan, lengkap dengan severity, confidence, blast radius, status, dan affected asset.",
    placement: "top",
  },
  {
    id: "evidence",
    route: "/projects/{projectId}/findings/{findingId}",
    target: "evidence-section",
    title: "Evidence & Telemetry",
    text: "Setiap finding harus didukung evidence. ThreatLens tidak membuat klaim tanpa bukti.",
    placement: "top",
  },
  {
    id: "ai_investigator",
    route: "/projects/{projectId}/ai",
    target: "ai-investigator-panel",
    title: "AI Investigator",
    text: "AI Investigator membuat summary berbasis evidence, timeline, graph, remediation, standards, dan scan history. MVP ini memakai template-based summary, bukan external LLM.",
    placement: "top",
  },
  {
    id: "reports",
    route: "/projects/{projectId}/reports",
    target: "report-generator",
    title: "Report Generator",
    text: "Reports menggabungkan project summary, findings, evidence, scan history, AI summary, remediation, dan standards mapping.",
    placement: "right",
  },
  {
    id: "finish",
    route: "/dashboard",
    target: "user-menu",
    title: "You are ready",
    text: "Sekarang kamu sudah memahami alur dasar ThreatLens. Kamu bisa mengulang tour dari menu user atau settings.",
    placement: "top",
  },
];
