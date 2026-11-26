# Design Spec — LocknGo

Satu halaman acuan visual. Tujuannya mencegah tampilan "beda gaya" antar
halaman. Semua nilai di bawah dipakai sebagai CSS custom properties.

---

## 1. Prinsip visual

1. **Tenang, bukan ramai.** Ini layanan penitipan barang — kepercayaan lebih
   penting daripada kesan meriah.
2. **Angka harus terbaca dari jauh.** Hitung mundur dan nominal adalah elemen
   terpenting di layar.
3. **Identitas warna jelas & terarah:**
   - **Bloodwine (`#780115`)** sebagai warna utama brand: tombol primer (CTA), header aktif, garis aksen, dan status terpilih.
   - **Sunflare (`#F7B638`)** sebagai aksen hangat: penarik perhatian (*highlights*), badge pendukung, dan tag promo.
   - **Hijau zamrud (`#10B981`)** diisolasi murni hanya untuk status fungsional sukses/selesai (*ready unit*, langkah selesai).
4. **Satu aksen per layar.** Kalau semuanya menonjol, tidak ada yang menonjol.

---

## 2. Warna

### Palet Brand Utama

| Token | Hex | Nilai Visual | Dipakai untuk |
|---|---|---|---|
| `--bloodwine` | `#780115` | Deep Burgundy / Crimson | Identitas utama brand, tombol Primary, judul penting, border terpilih |
| `--bloodwine-d` | `#5A0110` | Dark Crimson | Hover & active state tombol Primary |
| `--bloodwine-l` | `#FCEEF1` | Soft Wine Mist | Latar lembut elemen terpilih, badge wine |
| `--sunflare` | `#F7B638` | Warm Golden Amber | Aksen sorotan, badge promo/prototipe, highlight perhatian, pulsing halo |
| `--sunflare-d` | `#D99B22` | Deep Amber | Hover elemen berlatar Sunflare |
| `--sunflare-l` | `#FFF4DC` | Soft Warm Cream | Latar lembut badge aksen dan tag |

### Palet Netral & Latar

| Token | Hex | Dipakai untuk |
|---|---|---|
| `--ink` | `#2B1A1D` | Teks utama, teks judul tebal |
| `--ink-2` | `#3D282C` | Teks sekunder tebal, heading alternatif |
| `--muted` | `#6E5D62` | Teks penjelas, label, placeholder |
| `--line` | `#EFDFD0` | Garis pemisah, border kartu default, divider |
| `--bg` | `#FFFCF7` | Latar belakang halaman (krem hangat, nyaman di mata) |
| `--card` | `#FFFFFF` | Latar kartu putih bersih |

### Warna Status Fungsional

| Status | Warna | Token Hex | Wajib disertai |
|---|---|---|---|
| Normal / Siap (Ready) | Hijau zamrud | `--green` (`#10B981`), `--green-l` (`#E6F9F2`) | teks atau ikon centang |
| Hampir habis (<10 menit) | Sunflare / Amber | `--sunflare` (`#F7B638`), `--sunflare-l` (`#FFF4DC`) | teks "Kurang dari 10 menit" |
| Habis / Telat / Bahaya | Merah krisan | `--red` (`#DC2626`), `--red-l` (`#FDECEC`) | teks "Kelebihan waktu" |
| Netral / informasi | Muted | `--muted` (`#6E5D62`) | — |

Warna **tidak boleh** menjadi satu-satunya penyampai status. Selalu ada teks pendamping.

---

## 3. Tipografi

Rekomendasi kombinasi tipografi resmi (*font pairing*):

1. **Primary UI & Text: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)**
   * **Fallback:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
   * **Karakter:** Sans-serif geometris modern dengan *x-height* proporsional. Memberikan keterbacaan optimal di layar smartphone (Android/iOS) maupun desktop, serta menghadirkan kesan teknologi modern yang terpercaya (*clean & professional*).
2. **Technical & Monospace: [Space Mono](https://fonts.google.com/specimen/Space+Mono)**
   * **Fallback:** `ui-monospace, 'SFMono-Regular', Menlo, Monaco, Consolas, monospace`
   * **Karakter:** Huruf monospaced yang presisi. Digunakan khusus pada elemen data teknis: timer hitung mundur, nominal uang Rupiah, kode jaga OTP 6-digit, nomor unit loker (`M-02`, `L-01`), dan jam operasional. Sifat *fixed-width* menjaga angka tidak bergeser (*jitter-free*) saat detik berganti.

### Skala Tipografi

| Peran | Font | Ukuran | Berat | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| Judul hero | Plus Jakarta Sans | `clamp(38px, 5.1vw, 62px)` | 850 | -0.035em | 1.15 |
| Judul bagian | Plus Jakarta Sans | `clamp(27px, 3.4vw, 40px)` | 800 | -0.022em | 1.18 |
| Judul kartu | Plus Jakarta Sans | 20px | 800 | -0.025em | 1.3 |
| Subjudul | Plus Jakarta Sans | 17px | 400 | normal | 1.6 |
| Teks isi | Plus Jakarta Sans | 15px | 400 | normal | 1.65 |
| Teks kecil | Plus Jakarta Sans | 13px | 400 | normal | 1.55 |
| Label / Tag | Plus Jakarta Sans / Space Mono | 12px | 700 | 0.08em (kapital) | 1.4 |
| Hitung mundur besar | Space Mono | `clamp(38px, 7vw, 56px)` | 700 | -0.04em | 1.0 |
| Nominal uang | Space Mono | 26–30px | 700 | -0.03em | 1.2 |
| Kode jaga / OTP | Space Mono | 22–26px | 700 | 0.18em | 1.2 |

**Aturan**
- Tidak ada teks di bawah 12px
- Teks isi tidak di bawah 15px (menjaga kenyamanan membaca di layar smartphone)
- Semua data angka teknis memakai font **Space Mono** atau `font-variant-numeric: tabular-nums`
- Judul maksimal 3 baris pada viewport mobile 390px

---

## 4. Jarak

Skala kelipatan 4px:

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `xs` | 4px | Jarak ikon–teks |
| `sm` | 8px | Dalam komponen |
| `md` | 12px | Antar elemen dalam kartu |
| `lg` | 16px | Padding kartu (HP) |
| `xl` | 24px | Padding kartu (desktop), jarak antar kartu |
| `2xl` | 32px | Jarak antar blok |
| `3xl` | 48px | Jarak antar bagian |
| `4xl` | 92px | Padding vertikal bagian (desktop) |

Di HP, padding vertikal bagian turun menjadi 64px.

---

## 5. Radius & bayangan

| Token | Nilai |
|---|---|
| `--radius-sm` | 10px (input, tombol kecil) |
| `--radius` | 16px (kartu) |
| Kartu besar | 20px |
| Tombol | 12px (besar: 14px) |
| Pil / badge | 999px |

| Bayangan | Nilai | Dipakai |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(10,22,38,.05)` | Kartu datar |
| `--shadow` | `0 1px 2px …, 0 10px 28px rgba(10,22,38,.07)` | Kartu utama |
| `--shadow-lg` | `0 2px 6px …, 0 24px 60px rgba(10,22,38,.12)` | Modal, QR, float card |

Bayangan selalu lembut dan menyebar. Tidak ada bayangan tajam atau berwarna.

---

## 6. Komponen

### Tombol

| Varian | Latar | Teks | Border | Dipakai |
|---|---|---|---|---|
| Primary | `--bloodwine` | putih | — | Aksi utama (Pesan loker, Bayar), satu per layar |
| Accent | `--sunflare` | `--bloodwine` | — | Aksi promosi, penarik perhatian |
| Dark | `--ink` | putih | — | Aksi di latar terang |
| Ghost | putih | `--bloodwine` | `--line` | Aksi sekunder, outline |
| Quiet | transparan | `--muted` | — | Batal, kembali |
| Danger | `--red` | putih | — | Hapus, batalkan permanen |

**Ukuran**
- Standar: padding `13px 22px`, tinggi ±46px
- Besar: padding `16px 28px`, tinggi ±54px
- Kecil: padding `9px 15px`, tinggi ±36px
- Minimal area sentuh: **44 × 44 px** — tombol kecil tetap diberi padding

**Keadaan**
- Hover: warna lebih gelap (`--bloodwine-d`), bayangan halus bertambah (`box-shadow: 0 4px 14px rgba(120,1,21,.28)`)
- Aktif: turun 1px (`translateY(1px)`)
- Nonaktif: opacity 0.45, tidak ada bayangan, `pointer-events: none`
- Fokus: outline 2px `--bloodwine` dengan offset 2px

**Aturan:** maksimal satu tombol Primary per layar.

### Kartu

- Latar putih, border 1px `--line`, radius 16–20px
- Padding 22px (HP) / 32px (desktop)
- Bayangan `--shadow`
- Judul 20px, deskripsi 14.5px `--muted`

### Input

- Tinggi 50px, padding `14px 16px`
- Border 1.5px `--line`, latar `#FCFDFE`
- Radius 12px, ukuran huruf 16px (mencegah zoom otomatis di iOS)
- Fokus: border `--bloodwine`, latar putih, cincin `0 0 0 4px rgba(120,1,21,.12)`
- Selalu punya `<label>` di atas

### Kartu pilihan (opt)

- Border 1.5px, radius 14px
- Terpilih: border `--bloodwine`, latar `--bloodwine-l`, garis kiri 4px `--bloodwine`
- Harga rata kanan, font Space Mono atau `tabular-nums`
- Nonaktif: opacity 0.5, kursor default, disertai alasan

### Badge

| Varian | Latar | Teks | Dipakai untuk |
|---|---|---|---|
| Ok | `--green-l` | `--green-d` (`#047857`) | Ready unit, terverifikasi, aktif |
| Accent | `--sunflare-l` | `#8A5A05` | Tag promo, prototipe, rekomendasi |
| Brand | `--bloodwine-l` | `--bloodwine` | Kategori venue, kode loker |
| Warn | `--sunflare-l` | `#8A5A05` | Peringatan sisa waktu <10 menit |
| Err | `--red-l` | `#A72A2E` | Telat, gagal verifikasi |
| Mute | `#EDF1F6` | `#6E8095` | Info netral |

Radius pil (999px), huruf 12px berat 700.

### Toast

- Posisi: kanan bawah (desktop), atas penuh (HP)
- Latar `--ink`, teks putih
- Ikon berwarna sesuai jenis (hijau/amber/merah)
- Durasi tampil 4,6 detik, masuk dari kanan
- Maksimal 3 bertumpuk

### QR

- Ukuran minimal 200 × 200 px
- Bingkai putih dengan sudut Bloodwine (`#780115`) 3px
- Quiet zone minimal 2 modul
- Kontras hitam `--ink` di atas putih murni
- Kedaluwarsa: opacity 0.35 + grayscale + label "Kedaluwarsa"

### Hitung mundur

- Angka `tabular-nums`, letter-spacing -0.04em
- Label kapital 12.5px di atas
- Warna berubah sesuai sisa waktu (lihat bagian 2)
- Tidak pernah lebih kecil dari 32px di layar mana pun

---

## 7. Tata letak

### Lebar

| Konteks | Maksimum |
|---|---|
| Halaman penuh | 1160px |
| Halaman baca (FAQ, syarat) | 820px |
| Kartu form | 520px |
| Padding samping | 24px (desktop) / 18px (HP) |

### Grid

- Desktop: 12 kolom, jarak 20px
- Kartu masalah/keamanan: 3 kolom → 2 kolom (tablet) → 1 kolom (HP)
- Kartu ukuran: 2 kolom → 1 kolom
- Langkah cara pakai: 4 kolom → 2 kolom → 1 kolom

---

## 8. Animasi

| Kejadian | Durasi | Easing |
|---|---|---|
| Panel masuk | 320ms | `cubic-bezier(.2,.7,.3,1)` |
| Toast masuk | 280ms | `cubic-bezier(.2,.8,.3,1)` |
| Pintu terbuka | 700ms | `cubic-bezier(.3,.8,.3,1)` |
| Hover tombol | 180ms | ease |
| Ikon sukses | 500ms | `cubic-bezier(.2,.9,.3,1.3)` |

**Aturan**
- Tidak ada animasi lebih dari 700ms
- Semua animasi dimatikan bila `prefers-reduced-motion: reduce`
- Animasi tidak boleh menunda aksi pengguna

---

## 9. Ikonografi

- Gaya: garis (stroke) 2–2.4px, ujung membulat, tanpa isi
- Ukuran: 16px (dalam tombol), 18–21px (dalam kartu), 36px (status besar)
- Sumber: SVG inline, bukan font ikon (agar tidak ada permintaan jaringan)
- Warna mengikuti teks di sekitarnya

---

## 10. Nada bahasa

| Konteks | Nada | Contoh |
|---|---|---|
| Judul pemasaran | Ringkas, percaya diri | "Titip barang, jalan terus." |
| Penjelasan | Netral, jelas | "Waktu sewa mulai saat pintu tertutup." |
| Kesalahan | Tenang, memberi jalan keluar | "Kode tidak cocok. Coba lagi." |
| Peringatan | Jelas, tanpa menakut-nakuti | "Kurang dari 5 menit. Tarif kelebihan mulai berjalan." |
| Konfirmasi | Tegas | "Ya, batalkan" |

**Aturan**
- Sapaan "kamu", bukan "Anda" (kecuali di syarat dan ketentuan)
- Tidak ada tanda seru berlebihan
- Tidak ada istilah teknis ke pengguna ("state", "token", "payload")
- Angka selalu ditulis lengkap: "Rp35.000", bukan "35rb"
- Waktu memakai format 24 jam: "21.30", bukan "9:30 PM"

---

## 11. Daftar periksa konsistensi

Sebelum dianggap selesai, pastikan:

- [ ] Semua tombol memakai varian dari bagian 6
- [ ] Tidak ada dua tombol Primary dalam satu layar
- [ ] Semua angka uang memakai `tabular-nums` dan format `RpXX.XXX`
- [ ] Semua waktu memakai format 24 jam
- [ ] Semua status punya teks, bukan hanya warna
- [ ] Semua input punya label
- [ ] Tidak ada teks di bawah 12px
- [ ] Radius dan bayangan hanya dari token
- [ ] Ikon memakai gaya garis yang sama
- [ ] Tampilan diuji pada 390px, 768px, dan 1440px
