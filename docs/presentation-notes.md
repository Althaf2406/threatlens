# ThreatLens Presentation Notes

Gunakan catatan ini sebagai panduan narasi saat mempresentasikan atau mendemokan ThreatLens kepada dosen penguji, evaluator, atau rekan tim.

## 1. Opening Problem
"Selamat pagi/siang. Saat ini, banyak developer, mahasiswa IT, maupun tim kecil yang rutin membangun aplikasi, namun kesulitan dalam memahami *security posture* dari sistem yang mereka buat. Aplikasi *vulnerability scanner* di pasaran seringkali terlalu ofensif, rumit, dan berbahaya jika dijalankan tanpa keahlian khusus. Oleh karena itu, kami membangun **ThreatLens**."

## 2. Solution
"ThreatLens adalah AI Security Investigator Dashboard yang bersifat **defensive-only**. Kami membantu developer menganalisis aset aplikasi mereka sendiri, menghasilkan temuan keamanan yang murni berbasis bukti (*evidence-based*), dan menyusun panduan perbaikan yang jelas, tanpa pernah mengeksekusi serangan yang merusak."

## 3. Key Workflow
"Alur utama dari ThreatLens sangat terstruktur:
Pertama, kita membuat **Project**.
Lalu mendaftarkan **Asset** (misalnya `api.example.com`) dan melakukan konfirmasi kepemilikan.
Selanjutnya kita jalankan **Passive Check**—ini adalah simulasi pengumpulan metadata secara non-intrusif.
Hasilnya masuk ke **Scan History**, memunculkan **Findings**.
Setiap *finding* memiliki **Evidence** yang jelas.
Kita juga bisa melihat runtutan kejadian di **Timeline** dan memvisualisasikan koneksi aset di **Attack Graph**.
Jika butuh pemahaman ekstra, **AI Summary** akan menjelaskannya secara manusiawi.
Lalu eksekusi perbaikan melalui **Remediation**, dan lihat keselarasan kepatuhan di **Standards** (seperti OWASP).
Terakhir, kita bisa mencetak **Report**."

## 4. Defensive Boundary
"Satu hal yang paling ditekankan dalam ThreatLens: **Ini bukan alat hacking**. 
Semua fungsionalitas dibatasi secara ketat:
- Tidak ada brute force.
- Tidak ada *credential stealing*.
- Tidak ada pengiriman eksploit.
Semua bersifat *passive check*, analisis data sintetik (*synthetic lab*), dan murni untuk memandu perbaikan (remediasi)."

## 5. User Demo (Tunjukkan UI)
*Log in sebagai demo user (demo@threatlens.local / password123).*
"Mari kita lihat dari sisi praktisi keamanan. Di *Dashboard*, kita bisa melihat ringkasan status. Saya akan masuk ke *Demo Web App* dan menunjukkan bagaimana *finding* disajikan dengan tingkat keparahan (*severity*), tingkat keyakinan (*confidence*), dan bagaimana AI kami meringkas konteks risiko tanpa memberikan instruksi eksploitasi."

## 6. Admin Demo (Tunjukkan UI)
*Log in sebagai admin user (admin@threatlens.local / admin123).*
"Dari sisi sistem administrator, kita memiliki kontrol penuh terhadap *engine*. Di menu *Settings*, admin dapat menghidup-matikan atau menyesuaikan ambang batas (*threshold*) dari **Detection Rules** secara global. Admin juga bisa mengelola data **Security Standards**—mengimpor standar baru dalam format JSON atau mengaktifkan versi kerangka kerja seperti OWASP 2021."

## 7. Closing
"Sebagai penutup, ThreatLens memberdayakan pengembang untuk memahami risiko keamanan secara proaktif. Melalui pendekatan defensif, penjelasan berbasis AI, dan pelacakan berbasis bukti, ThreatLens memastikan bahwa keamanan bukan lagi sekadar hasil _scan_ yang membingungkan, melainkan panduan perbaikan yang bisa langsung dieksekusi. Terima kasih."
