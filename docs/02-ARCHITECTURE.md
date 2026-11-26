# Arsitektur — LocknGo Web Prototype

---

## 1. Keputusan teknologi

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Markup | HTML5 | Tidak perlu build step, bisa dibuka langsung |
| Gaya | CSS murni (custom properties) | Ringan, tidak ada dependensi, mudah diubah |
| Logika | JavaScript ES6+ (vanilla) | Tanpa framework, tanpa npm install |
| Penyimpanan | `localStorage` | Bertahan saat refresh, tanpa server |
| QR | `qrcode-generator` (lokal, 57 KB) | Offline, tidak bergantung CDN |
| Font | Plus Jakarta Sans + Space Mono (Google Fonts) | Geometris modern, keterbacaan tinggi, presisi monospaced untuk kode & hitungan waktu |
| Build | Tidak ada | Kurangi risiko gagal saat presentasi |

### Kenapa tanpa framework

Prototipe ini dinilai dari **kejelasan alur**, bukan kerumitan teknis. Tanpa
build step:

- Bisa dibuka dengan klik dua kali pada `index.html`
- Bisa dikirim sebagai ZIP dan langsung jalan di laptop teman kelompok
- Tidak ada `node_modules`, tidak ada versi Node yang harus cocok
- Risiko gagal saat presentasi hampir nol

Struktur kode tetap dipisah per lapisan, sehingga bila nanti pindah ke
Next.js + PostgreSQL, hanya lapisan penyimpanan yang perlu diganti.

---

## 2. Struktur folder

```
lockngo/
├── index.html              Halaman penjelasan produk
├── app.html                Aplikasi pemesanan (alur utama)
├── docs/
│   ├── 01-PRD.md
│   ├── 02-ARCHITECTURE.md
│   ├── 03-DECISIONS.md
│   ├── 04-FLOWS.md
│   ├── 05-CONTENT-EDGE.md
│   ├── 06-DESIGN-SPEC.md
│   ├── 07-TEST-CHECKLIST.md
│   └── 08-OPERATIONS.md    Listrik/internet mati, kehilangan, sengketa
├── css/
│   └── style.css           Satu stylesheet, terbagi per bagian
├── js/
│   ├── data.js             Konfigurasi bisnis (tarif, ukuran, lokasi)
│   ├── engine.js           Logika murni: harga, waktu, denda, kode jaga
│   ├── app.js              Alur pemesanan, render, event
│   └── vendor/
│       └── qrcode.min.js   Pustaka QR lokal
└── README.md
```

---

## 3. Pemisahan lapisan

```
┌─────────────────────────────────────────┐
│  app.html / index.html                 │  Struktur
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  app.js                                 │  Tampilan + event
│  - render panel, baca input, toast      │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  engine.js                              │  Logika bisnis (murni)
│  - priceOf, lateCalc, allocLocker       │
│  - makeRent, checkGuardCode, Time       │
│  - tidak menyentuh DOM                  │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  data.js                                │  Konfigurasi
│  - CFG: tarif, ukuran, lokasi, aturan   │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Store (localStorage)                   │  Persistensi
└─────────────────────────────────────────┘
```

**Aturan:** `engine.js` tidak boleh menyentuh DOM. `app.js` tidak boleh
mengandung rumus harga. Ini yang membuat logika bisa diuji terpisah dan
dipindah ke backend tanpa ditulis ulang.

---

## 4. Model data

Semua tersimpan dalam satu kunci `localStorage` bernama `lockngo.v1`.

```js
{
  user: { phone: "081234567890" } | null,

  otp: { code: "123456", phone: "0812...", expires: 1699999999999 } | null,

  pending: {                    // pesanan menunggu / baru dibayar
    id: "ORD-A1B2C3D",
    locationId: "tp1",
    locationName: "Tunjungan Plaza 1",
    size: "M",                  // M | L
    hours: 3,                   // 3 | 6 | 12 | 24
    amount: 35000,
    guardCode: "482913",        // kode jaga 6 digit
    qrToken: "QR-TITIP-XXXX",
    createdAt: 1699999999999,
    paidAt: 1699999999999 | undefined
  } | null,

  active: [ Rent ],             // sewa berjalan

  history: [ HistoryItem ],     // transaksi selesai

  booking: { ... } | null,      // reservasi dari jauh (opsional)

  timeOffset: 0,                // jam virtual demo (ms)

  counters: {}                  // cadangan untuk statistik
}
```

### Rent (sewa)

```js
{
  id: "LG-XXXXXXX",
  locationId: "tp1",
  locationName: "Tunjungan Plaza 1",
  size: "M",
  hours: 3,
  lockerNo: 3,                  // nomor unit di lokasi
  lockerLabel: "M-03",          // label yang dilihat pelanggan
  guardCode: "482913",
  qrToken: "QR-TITIP-XXXX",

  pickupCode: "482913",
  pickupToken: "QR-PICKUP-XXXX",
  pickupExpires: 1699999999999,

  paidAmount: 35000,
  latePaid: 0,
  lateBlocks: 0,

  bookedAt: 1699999999999,
  startAt: 1699999999999,       // saat pintu tertutup
  endAt: 1700000000000,         // startAt + hours (+ perpanjangan)
  finishedAt: 1700000000000,

  status: "opening" | "active" | "late" | "done",

  doorOpen: false,
  doorOpenUntil: 0,
  reopenUsed: false,
  corrections: 0,
  correctionUntil: 0,

  extensions: [ { hours: 1, amount: 15000, at: 1699999999999 } ],
  reminded: { "30": true, "10": true },   // pengingat yang sudah dikirim
  log: [ { t: 1699999999999, e: "Sewa dimulai." } ]
}
```

### HistoryItem

```js
{
  id: "LG-XXXXXXX",
  type: "rent" | "refund",
  at: 1699999999999,
  label: "Sewa selesai",
  locationName: "Tunjungan Plaza 1",
  size: "M",
  hours: 3,
  amount: 35000,
  lockerLabel: "M-03",
  startAt: 1699999999999,
  endAt: 1700000000000,
  latePaid: 0
}
```

---

## 5. State machine

### Alur utama

```
        ┌──────────┐
        │  LOGIN   │  nomor HP + OTP
        └────┬─────┘
             │
        ┌────▼─────┐
        │  SELECT  │  lokasi + ukuran + durasi + setuju terlarang
        └────┬─────┘   (validasi jam operasional di sini)
             │
        ┌────▼─────┐
        │   PAY    │  QRIS simulasi
        └────┬─────┘
             │
        ┌────▼─────┐
        │  TITIP   │  QR Titip + kode jaga
        └────┬─────┘
             │ scan QR / ketik kode
        ┌────▼─────┐
        │   DOOR   │  pintu terbuka, 180 detik
        └────┬─────┘
             │ tutup pintu  ──► [barang tidak muat] ──► refund 100%
             │
        ┌────▼─────┐
        │  ACTIVE  │  hitung mundur, reminder, tambah durasi
        └────┬─────┘
             │ tekan "Ambil barang"
        ┌────▼─────┐
        │  PICKUP  │  QR pickup 10 menit
        └────┬─────┘
             │ scan QR / ketik kode
             │
        ┌────▼─────┐
        │  CHOICE  │  Finish / Keep
        └────┬─────┘
             │
      ┌──────┴───────┐
      │              │
 ┌────▼────┐    ┌────▼─────┐
 │  DONE   │    │   LATE   │  bayar denda dulu
 └─────────┘    └────┬─────┘
                     │
              ┌──────┴──────┐
              │             │
         Finish          Keep
              │             │
         ┌────▼────┐   ┌────▼─────┐
         │  DONE   │   │  ACTIVE  │  sewa baru 3 jam
         └─────────┘   └──────────┘
```

### Status sewa

| Status | Arti | Transisi keluar |
|---|---|---|
| `opening` | Pintu terbuka, menunggu barang | `active` (pintu tertutup) atau refund (barang tidak muat) |
| `active` | Sewa berjalan, waktu masih ada | `late` (waktu habis), `done` (Finish) |
| `late` | Waktu habis, denda berjalan | `done` (bayar + Finish) atau `active` (bayar + Keep) |
| `done` | Selesai, loker tersedia | — |

---

## 6. Mesin waktu

Prototipe memakai **jam virtual** supaya aturan waktu bisa diperagakan
tanpa menunggu berjam-jam.

```js
const Time = {
  offset: 0,
  now() { return Date.now() + this.offset; },
  advance(ms) { this.offset += ms; }
};
```

Semua perhitungan — hitung mundur, denda, pengingat — memakai `Time.now()`,
bukan `Date.now()` langsung. `offset` disimpan di `localStorage` agar jam
virtual konsisten setelah refresh.

Panel demo menyediakan tombol: +1 menit, +5 menit, +30 menit, +1 jam, +3 jam.

**Penting untuk presentasi:** tombol ini yang memungkinkan memperagakan
pengingat 30/10/5 menit dan denda dalam hitungan detik.

---

## 7. Responsif

### Prinsip

**Mobile-first.** Pelanggan memakai HP, jadi HP adalah target utama.
Desktop adalah penyesuaian, bukan sebaliknya.

### Breakpoint

| Lebar | Sasaran | Perubahan utama |
|---|---|---|
| < 640px | HP | Satu kolom, tabel tarif jadi kartu, dock demo penuh lebar |
| 640–900px | Tablet | Dua kolom untuk kartu, navigasi tetap ringkas |
| > 900px | Desktop | Grid penuh, ilustrasi loker tampil, navigasi horizontal |

### Ketentuan

- Tombol minimal **44 × 44 px** (standar sentuh)
- Teks isi minimal **15px**, tidak ada teks di bawah 12px
- QR minimal **200 × 200 px** agar mudah dipindai
- Tabel tarif berubah menjadi kartu bertumpuk di bawah 640px
- Hitung mundur tetap terlihat tanpa perlu scroll
- Tidak ada scroll horizontal pada lebar 320px
- `prefers-reduced-motion` dihormati (animasi dimatikan)

### Satuan

- Layout: `%`, `fr`, `max-width` dengan pembungkus
- Jarak dan ukuran huruf: `rem` / `px`
- Hindari `vw` untuk teks (menyebabkan teks terlalu kecil di HP)

---

## 8. Aksesibilitas

- Semua input punya `<label>` terhubung
- Tombol punya teks yang deskriptif, bukan hanya ikon
- Kontras teks minimal 4.5:1
- Fokus keyboard terlihat (outline pada `:focus-visible`)
- Status tidak disampaikan hanya lewat warna — selalu disertai teks
- Modal bisa ditutup dengan `Esc`

---

## 9. Kinerja

- Tanpa framework, tanpa bundler → muatan awal < 100 KB (di luar font)
- Pustaka QR disimpan lokal, bukan CDN → tetap jalan tanpa internet
- Satu file CSS, di-cache browser
- Tidak ada gambar besar; ilustrasi loker memakai CSS dan SVG
- Render ulang hanya pada panel aktif (bukan seluruh halaman)

---

## 10. Batasan yang disadari

1. **Data hanya di satu browser.** Membuka di perangkat lain tidak membawa data.
2. **Tidak ada verifikasi nyata.** OTP ditampilkan di layar; pembayaran disimulasikan.
3. **Bukan sistem multi-pengguna.** Dashboard membaca data yang sama dari browser yang sama.
4. **Tidak ada keamanan.** Kode jaga disimpan apa adanya di `localStorage`.

Untuk prototipe akademik, keempat batasan ini dapat diterima dan sebaiknya
disebutkan secara terbuka saat presentasi — menunjukkan kalian memahami
perbedaan prototipe dan produk produksi.

### Jalur pengembangan (bila dilanjutkan)

| Fase | Perubahan |
|---|---|
| 1 | Ganti `Store` dengan API call ke backend |
| 2 | Backend Node/Express + PostgreSQL, tabel: users, orders, rentals, lockers, logs |
| 3 | Integrasi QRIS nyata (Midtrans/Xendit) dan OTP nyata (WhatsApp/SMS gateway) |
| 4 | WebSocket untuk status loker real-time |
| 5 | Integrasi perangkat keras: kontrol kunci, sensor pintu, sensor isi |
