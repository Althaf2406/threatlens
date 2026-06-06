# ThreatLens Feature Documentation Index

Selamat datang di direktori dokumentasi teknis fitur ThreatLens. Halaman ini berisi daftar lengkap modul dan fitur utama yang diimplementasikan dalam ThreatLens MVP 1.0. Setiap tautan di bawah ini merujuk ke analisis mendalam mengenai User Flow, Struktur Route, Backend API, Struktur Fungsi, Peta Koneksi, dan Keamanan khusus untuk masing-masing fitur.

## Daftar Fitur Utama

1. **[01. Authentication & Session Management](01-authentication.md)**
   Membahas registrasi user baru, login, logout, proteksi route Next.js middleware, manajemen session berbasis HTTP-only JWT Cookie, serta pengecekan role & kepemilikan.

2. **[02. Dashboard Overview](02-dashboard.md)**
   Menyediakan ringkasan status global seperti jumlah project aktif, kuota token AI, widget findings dengan risiko tinggi, serta jalan pintas navigasi administrator.

3. **[03. Project Workspaces & Management](03-project-management.md)**
   Mengelola isolasi workspace antar project, pembatasan hak akses berbasis kepemilikan user, serta data ringkasan posture score per project.

4. **[04. Asset Inventory & Verification](04-asset-management.md)**
   Membahas inventarisasi aset, penambahan tipe target (Website URL, API Endpoint, dsb.), verifikasi kepemilikan aset tiruan, serta inisiasi pemindaian.

5. **[05. Passive Platform Checker](05-passive-platform-checker.md)**
   Menjelaskan mesin pemindaian defensif pasif yang mencocokkan tipe aset dengan aturan aktif untuk memproduksi temuan tanpa melakukan eksploitasi aktif.

6. **[06. Synthetic Security Lab](06-synthetic-lab.md)**
   Menguraikan simulator log anomali keamanan buatan (sintetik) untuk melatih praktisi mendeteksi serangan tanpa menggunakan data sensitif riil.

7. **[07. Findings & Evidence Management](07-findings-and-evidence.md)**
   Menguraikan daftar temuan keamanan lengkap dengan tingkat keparahan (severity), tingkat keyakinan (confidence), blast radius, dan visualisasi bukti mentah (evidence).

8. **[08. Scoped Incident Timeline](08-incident-timeline.md)**
   Membahas rekonstruksi kronologis dari log kejadian yang terisolasi dalam lingkup project.

9. **[09. Attack Graph Visualization](09-attack-graph.md)**
   Membahas visualisasi relasional topologi aset dan hubungannya dengan kerentanan aktif.

10. **[10. AI Investigator (Defensive Summary)](10-ai-investigator.md)**
    Menjelaskan generator laporan ringkas risiko berbasis template AI defensif tanpa menyajikan perintah eksploit.

11. **[11. Remediation Checklist](11-remediation.md)**
    Menjelaskan pelacakan tugas-tugas perbaikan yang berkorelasi dengan temuan aktif.

12. **[12. Standards & Compliance Mapping](12-standards-mapping.md)**
    Menguraikan integrasi temuan dengan standar keamanan eksternal seperti OWASP Top 10 dan CWE.

13. **[13. Report Generation](13-reports.md)**
    Membahas ekspor laporan teknis dan eksekutif ringkas beserta disclaimer keamanan yang relevan.

14. **[14. Scan History & Compare](14-scan-history.md)**
    Menjelaskan riwayat scanning, tren skor posture keamanan dari waktu ke waktu, serta pembandingan scan.

15. **[15. Detection Rule Management](15-detection-rule-management.md)**
    Menyediakan kontrol administratif global untuk menyalakan/mematikan dan mengatur ambang batas deteksi.

16. **[16. Settings & System Administration](16-settings-and-admin.md)**
    Mendokumentasikan konfigurasi global sistem, pengelolaan standar keamanan, pembatasan kuota, serta batasan akses admin-only.

17. **[17. Interactive Guided Onboarding Tour](17-guided-onboarding.md)**
    Menyediakan panduan interaktif step-by-step untuk membantu pengguna baru memahami workflow defensif di ThreatLens.

18. **[18. Pricing & Usage Guardrails](18-pricing-and-usage-guardrails/feature.md)**
    Mendokumentasikan batasan paket Free vs Pro, batas project, kuota token AI, serta pencegahan biaya tidak terduga menggunakan AI lokal/template.

---

## Prinsip Desain ThreatLens
* **Defensive-Only**: Tidak ada fitur serangan, bypass, brute force, atau penyediaan exploit script.
* **Evidence-Based**: Setiap temuan didasari oleh bukti telemetry yang jelas dan valid.
* **Project-Scoped**: Seluruh data dan interaksi diisolasi secara ketat berdasarkan hak kepemilikan project.
