---
name: ui-ux-pro-max
description: >-
  LocknGo UI craft checklist: spatial rhythm, component states, visual restraint,
  motion budget, and direct Indonesian microcopy. Use when designing, reviewing,
  or refactoring layouts, components, interactions, and user-facing copy.
---

# LocknGo UI Craft

Token warna, font, dan aturan emoji mengikuti `AGENTS.md` bagian 2 — tidak diulang di sini.

## 1. Layout & Spacing

- Skala 8pt: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px. Padding kartu tidak boleh melebihi margin kontainer.
- Item yang berkaitan lebih dekat dibanding item yang tidak berkaitan.
- Kontainer `max-w-6xl` atau `max-w-7xl`, gutter minimal 16px di mobile dan 24px di desktop.
- Gap 8–12px untuk dashboard atau ringkasan checkout; 24–48px untuk landing dan hero.
- Maksimal dua level kartu bersarang.

## 2. Tipografi & Warna

- Hero 48–64px (leading 1.05–1.15, tracking -0.025em), H2 30–36px, H3 20–24px, body 14–16px, badge 11–12px.
- Kontras heading minimal 7:1, body minimal 4.5:1. Jangan pakai abu terang di bawah 13px.
- Data numerik (unit, timer, OTP, kode jaga, rupiah) memakai Space Mono agar tidak bergeser saat angka berubah.
- Tepat satu aksi primer per viewport atau kartu; aksi sekunder memakai gaya outline atau ghost.
- Maksimal dua warna dominan: 60% permukaan, 30% ink/bloodwine, 10% sunflare. Jangan menambah aksen baru jika token yang ada sudah cukup.

## 3. Komponen & State

- Tap target minimal 44x44px. Radius 12–16px dan konsisten di satu layar.
- Border 1px lebih disukai daripada bayangan tebal. Bayangan memakai warna hangat dengan opasitas rendah.
- Label input eksplisit di atas field; pesan validasi muncul tepat di bawah field yang bermasalah.
- Setiap elemen interaktif punya state: hover 150–200ms ease-out, active `scale(0.97–0.98)` 75–100ms, focus ring 2px dengan offset 2px (jangan dinonaktifkan), disabled opacity 40% dengan `cursor-not-allowed` dan alasan singkat.

## 4. Gerak & Review Visual

- Budget durasi: mikro 100–150ms, dropdown/tab 200–250ms, drawer/modal 300–350ms. Di atas 400ms terasa lambat.
- Elemen masuk cepat dan keluar segera. Animasikan `transform` dan `opacity`, bukan properti layout. Hormati `prefers-reduced-motion`.
- Reserve dimensi gambar atau skeleton mengikuti bentuk konten agar tidak terjadi pergeseran layout.
- Tolak blur blob ungu, glassmorphism bertumpuk, emoji dekoratif, card-in-card, badge warna-warni tanpa fungsi, dan slogan kosong.
- Ikon dari satu family dengan ketebalan goresan yang sama.
- Review 3 detik: apakah satu aksi paling penting langsung terlihat? Apakah ada elemen yang hanya mengisi ruang kosong? Jika iya, hapus.

## 5. Microcopy Bahasa Indonesia

- Gunakan kata kerja imperatif: "Pesan loker sekarang", "Buka pintu", "Bayar denda".
- Pesan error menyebut kondisi dan solusinya, bukan menyalahkan pengguna: "Nomor HP belum sesuai. Masukkan awalan 08 (10–14 digit)." atau "Kode jaga salah (1/3). Cek kembali 6 digit kode di HP."
- Kalimat di bawah 20 kata, informasi penting di awal.
- Hindari "seamless", "cutting-edge", "silakan klik untuk melakukan", dan pembuka kosong seperti "Di dunia yang serba cepat".
