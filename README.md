# LocknGo — Fullstack Web App (Next.js + TypeScript + Supabase)

Layanan penitipan barang pintar (smart locker) mandiri. Dibuat untuk proyek bisnis **Venture Creation — Kelompok 3**.

---

## Identitas & Brand Design

- **Sunflare:** `#F7B638` (Aksen dinamis, tombol aksi utama, badge interaktif)
- **Bloodwine:** `#780115` (Warna utama, header banner lokasi, teks judul, kontras tinggi)
- **Typography:**
  - **Plus Jakarta Sans** (Heading, subjudul, UI teks, tombol)
  - **Space Mono** (Monospace untuk kode loker, timer countdown, OTP, kode jaga 6 digit, tarif)

---

## Menjalankan Aplikasi (Next.js Modern)

### 1. Prasyarat
- Node.js versi 18+ (disarankan Node 20 / 22)
- npm / pnpm

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (Supabase)
Salin `.env.local.example` ke `.env.local`:
```bash
cp .env.local.example .env.local
```
Isi variabel Supabase dari dashboard proyek Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Eksekusi Skema Database
Buka **SQL Editor** di Supabase Dashboard Anda, lalu jalankan secara berurutan:
1. `supabase/schema.sql` — Tabel `locations`, `lockers`, `bookings`, `payments`, `activity_logs`, indeks, RLS, & Realtime.
2. `supabase/seed.sql` — Data 7 titik lokasi di Surabaya (Mall, Stasiun 24 Jam, Stadion) beserta unit loker M & L.

### 5. Menjalankan Server Lokal
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000):
- **Halaman Utama (Landing Page):** `http://localhost:3000/`
  - Header navigasi bersih dengan tombol "Pesan loker" & mobile drawer.
  - Hero section dinamis dengan badge "Smart locker untuk aktivitasmu".
  - Section Kegunaan (Titip belanjaan & paket).
  - Cara Kerja (Tab interaktif: Cara Titip vs Cara Ambil).
  - Ukuran & Tarif (Kalkulator interaktif M 107L & L 233L).
  - **Direktori Lokasi Paxelbox-Style:** Banner Bloodwine, search bar, filter pill, kartu lokasi dengan 24h timeline bar visual, dan peta interaktif Surabaya.
  - Keamanan & Jaminan (CCTV 24 Jam, Kode Jaga 6 Digit, Asuransi s.d Rp5 Juta).
  - FAQ Accordion interaktif.
- **Aplikasi Pemesanan (Interactive Booking):** `http://localhost:3000/pesan`
  - Stepper 7 langkah: Masuk OTP → Pilih Lokasi/Ukuran/Durasi → Bayar QRIS → Simpan (Pintu Terbuka) → Sewa Aktif (Countdown) → Ambil (Verifikasi QR/Kode Jaga & Denda) → Selesai (Nota Transaksi).
  - Dilengkapi dock **Jam Virtual Demo** di bagian bawah untuk menguji percepatan waktu (+1j, +3j, +24j) dan kalkulasi denda otomatis.

### 6. Build Produksi & Deploy ke Vercel
```bash
npm run build
npm run start
```
Untuk deploy ke Vercel:
1. Push repository ke GitHub.
2. Impor project ke Vercel.
3. Masukkan Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY`).
4. Klik **Deploy**.

---

## Struktur Folder Proyek

```
lockngo/
├── src/
│   ├── app/
│   │   ├── api/bookings/route.ts      # REST API handler pemesanan
│   │   ├── globals.css                # CSS Global & Tailwind directives
│   │   ├── layout.tsx                 # Root Layout + Google Fonts
│   │   ├── page.tsx                   # Landing page
│   │   └── pesan/page.tsx             # 7-step interactive booking app
│   ├── components/
│   │   ├── Navbar.tsx                 # Responsive header bar
│   │   ├── Footer.tsx                 # Footer & link informasi
│   │   └── landing/                   # Komponen modular landing page
│   │       ├── HeroSection.tsx
│   │       ├── KegunaanSection.tsx
│   │       ├── CaraPakaiSection.tsx
│   │       ├── UkuranSection.tsx
│   │       ├── LokasiSection.tsx      # Paxelbox-style directory & map
│   │       ├── KeamananSection.tsx
│   │       └── FaqSection.tsx
│   ├── lib/
│   │   ├── data.ts                    # Konfigurasi resmi bisnis LocknGo
│   │   ├── engine.ts                  # Engine tarif, denda, jam tutup, kode jaga
│   │   └── supabase/                  # Klien Supabase (browser & server)
│   └── types/
│       ├── database.ts                # PostgreSQL / Supabase TypeScript schema
│       └── locker.ts                  # Domain interfaces
├── supabase/
│   ├── schema.sql                     # DDL Database, RLS, Indexes, Realtime
│   └── seed.sql                       # Seed data 7 titik Surabaya & unit loker
├── docs/                              # Dokumentasi PRD, arsitektur, & desain
├── public/assets/                     # Gambar & logo publik Next.js
├── tailwind.config.ts                 # Palet warna Sunflare, Bloodwine, Cream
├── tsconfig.json                      # Konfigurasi TypeScript
├── package.json
└── README.md
```

---

## Aturan Bisnis & Tarif Resmi

| Ukuran | Volume & Dimensi | 1 Jam | 3 Jam | 6 Jam | 12 Jam | 24 Jam |
|---|---|---|---|---|---|---|
| **Medium (M)** | 124 Liter (55 × 50 × 45 cm) | Rp15.000 | Rp35.000 | Rp55.000 | Rp80.000 | Rp120.000 |
| **Large (L)** | 248 Liter (55 × 50 × 90 cm) | Rp25.000 | Rp50.000 | Rp75.000 | Rp110.000 | Rp150.000 |

- **Perpanjangan Sewa:** +1 Jam (M: Rp7.500, L: Rp13.500) | +3 Jam (M: Rp20.500, L: Rp37.500)
- **Kelebihan Waktu (Denda):** Rp5.000 per blok 5 menit (dibulatkan ke atas), maks Rp1.440.000 / 24 jam; selebih 24 jam barang diamankan petugas.
- **Unit Cadangan:** 1 unit per ukuran selalu dikunci untuk keperluan darurat/koreksi.
