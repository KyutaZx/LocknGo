# Alur — LocknGo

Semua alur ditulis sebagai langkah bernomor agar bisa langsung diuji.
Kode status merujuk ke `Rent.status` di `02-ARCHITECTURE.md`.

---

## F-01 — Alur utama: titip barang

| # | Pelaku | Aksi | Sistem |
|---|---|---|---|
| 1 | Pelanggan | Masukkan nomor HP | Validasi format (08, 10–14 digit) |
| 2 | Sistem | — | Kirim OTP (ditampilkan di layar untuk demo) |
| 3 | Pelanggan | Masukkan 6 digit OTP | Verifikasi, buat sesi |
| 4 | Pelanggan | Pilih lokasi | Tampilkan unit tersedia + jam operasional |
| 5 | Pelanggan | Pilih ukuran M / L | Tampilkan dimensi dan contoh barang |
| 6 | Pelanggan | Pilih durasi 3/6/12/24 jam | **Validasi jam operasional** (lihat F-08) |
| 7 | Sistem | — | Hitung total, tampilkan ringkasan |
| 8 | Pelanggan | Centang persetujuan barang terlarang | Aktifkan tombol "Lanjut bayar" |
| 9 | Pelanggan | Tekan "Lanjut bayar" | Buat pesanan status `pending` |
| 10 | Pelanggan | Bayar QRIS (simulasi) | Tandai `paidAt`, buat QR Titip + kode jaga |
| 11 | Pelanggan | Menuju lokasi | — |
| 12 | Pelanggan | Pindai QR Titip di tab loker | Alokasikan unit, status → `opening`, pintu buka 180 detik |
| 13 | Pelanggan | Masukkan barang, tutup pintu | `startAt` = sekarang, `endAt` = startAt + durasi, status → `active` |
| 14 | Sistem | — | Tampilkan nomor loker, jam berakhir, hitung mundur |

**Catatan penting:** sewa baru dimulai pada langkah 13, bukan langkah 10.
Waktu yang dipakai menunggu, berjalan ke loker, dan memasukkan barang tidak
dihitung.

---

## F-02 — Alur buka dengan kode jaga

| # | Pelaku | Aksi | Sistem |
|---|---|---|---|
| 1 | Pelanggan | Di halaman QR Titip, tekan "Kamera tidak bisa membaca? Pakai kode jaga" | Tampilkan modal input 6 digit |
| 2 | Pelanggan | Masukkan kode | Bandingkan dengan `guardCode` |
| 3 | Sistem | Kode salah | Pesan kesalahan, boleh coba lagi |
| 4 | Sistem | Kode benar | Lanjut ke langkah 12 F-01 (pintu terbuka) |
| 5 | Sistem | — | Tandai kode sudah dipakai |

Sama untuk QR Pickup: alur identik, hanya konteksnya berbeda.

---

## F-03 — Alur pickup: Finish tepat waktu

| # | Pelaku | Aksi | Sistem |
|---|---|---|---|
| 1 | Pelanggan | Tekan "Ambil barang" | Buat `pickupToken`, `pickupExpires` = +10 menit |
| 2 | Sistem | — | Tampilkan QR Pickup + kode jaga + hitung mundur 10 menit |
| 3 | Pelanggan | Pindai QR di tab loker | **Hitung waktu saat ini** |
| 4 | Sistem | Waktu masih ada | Pintu terbuka, tampilkan pilihan Finish / Keep |
| 5 | Pelanggan | Pilih Finish | Pintu terbuka |
| 6 | Pelanggan | Ambil semua barang, tutup pintu | Status → `done`, loker tersedia |
| 7 | Sistem | — | Tampilkan ringkasan + riwayat |

**Pemberitahuan wajib:** sebelum Finish, tampilkan *"Selesai lebih awal tidak
mengembalikan sisa waktu."*

---

## F-04 — Alur pickup: Keep (ambil sebagian)

| # | Pelaku | Aksi | Sistem |
|---|---|---|---|
| 1 | Pelanggan | Pindai QR Pickup | Pintu terbuka, pilihan muncul |
| 2 | Pelanggan | Pilih Keep | Pintu terbuka, sewa **tetap berjalan** |
| 3 | Pelanggan | Ambil sebagian barang, tutup pintu | `endAt` tidak berubah |
| 4 | Sistem | — | Tampilkan sisa waktu, kembali ke layar sewa |

**Kasus khusus:** bila pelanggan memilih Keep tetapi ternyata mengambil
semuanya, sewa otomatis dianggap selesai. Di prototipe, ini ditangani lewat
konfirmasi: *"Apakah loker sekarang kosong?"* → bila ya, selesaikan sewa.

---

## F-05 — Alur telat: bayar denda lalu Finish

| # | Pelaku | Aksi | Sistem |
|---|---|---|---|
| 1 | Pelanggan | Pindai QR Pickup (atau ketik kode) | **Hitung kelebihan waktu di sini** |
| 2 | Sistem | `overdue > 0` | Bulatkan ke atas per 5 menit, hitung denda |
| 3 | Sistem | — | Tampilkan rincian denda + QRIS + kunci 5 menit |
| 4 | Pelanggan | Bayar denda | Tandai lunas |
| 5 | Sistem | — | Pintu terbuka, status → `done` setelah pintu tertutup |

**Penting:** kelebihan waktu diukur saat QR **dipindai di loker**, bukan saat
tombol Pickup ditekan, dan bukan saat memilih Finish di layar.

**Contoh perhitungan**

| Kelebihan | Blok | Denda |
|---|---|---|
| 1 menit | 1 | Rp5.000 |
| 5 menit | 1 | Rp5.000 |
| 6 menit | 2 | Rp10.000 |
| 11 menit | 3 | Rp15.000 |
| 31 menit | 7 | Rp35.000 |
| 2 jam | 24 | Rp120.000 (batas) |

---

## F-06 — Alur telat: bayar denda lalu Keep

| # | Pelaku | Aksi | Sistem |
|---|---|---|---|
| 1 | Pelanggan | Pindai QR Pickup saat sudah telat | Hitung denda |
| 2 | Pelanggan | Pilih Keep | — |
| 3 | Sistem | — | Total = denda + sewa baru 3 jam, **satu pembayaran** |
| 4 | Pelanggan | Bayar | Pintu terbuka |
| 5 | Pelanggan | Ambil sebagian, tutup pintu | `endAt` baru = sekarang + 3 jam |
| 6 | Sistem | — | Jadwalkan ulang pengingat dari jam baru |

---

## F-07 — Alur batal dan refund

| Situasi | Refund | Lokasi |
|---|---|---|
| Batal sebelum barang disimpan (setelah bayar, sebelum scan) | 100% | Loker tidak pernah dipakai |
| Barang tidak muat (pintu terbuka, tombol batalkan) | 100% | Loker kembali tersedia |
| Batal ≥ 2 jam sebelum jam kedatangan (booking jauh) | 100% | Reservasi dilepas |
| Batal < 2 jam sebelum kedatangan | 50% | Reservasi hangus |
| Tidak datang (melewati masa tahan 30 menit) | 50% | Reservasi hangus, loker tersedia |
| Gangguan sistem (loker offline, QR gagal, pembayaran tertunda) | 100% | Dicatat di log |

---

## F-08 — Validasi jam operasional

| # | Kondisi | Sistem |
|---|---|---|
| 1 | Lokasi `alwaysOpen = true` | Semua durasi tersedia |
| 2 | Lokasi biasa, jam berakhir ≤ jam tutup | Durasi tersedia |
| 3 | Lokasi biasa, jam berakhir > jam tutup | Durasi **dinonaktifkan** + penjelasan |

**Contoh.** Mall tutup 22.00, sekarang 20.15.
- 3 jam → berakhir 23.15 → **ditolak**
- Pilihan yang tersedia: durasi yang berakhir sebelum 22.00, atau pindah ke lokasi akses 24 jam

**Pesan:** *"Mall tutup pukul 22.00. Pilih durasi maksimal 1 jam, atau gunakan
lokasi akses 24 jam (Stasiun Gubeng)."*

---

## F-09 — Alur tambah durasi

| # | Pelaku | Aksi | Sistem |
|---|---|---|---|
| 1 | Pelanggan | Tekan "Tambah durasi" | Tampilkan pilihan 1 jam / 3 jam + harga |
| 2 | Sistem | Sewa sudah berakhir | Tombol dinonaktifkan, arahkan ke pembayaran denda |
| 3 | Pelanggan | Pilih durasi | — |
| 4 | Sistem | — | `endAt` baru = `endAt` lama + tambahan |
| 5 | Sistem | — | Reset penanda pengingat, jadwalkan ulang dari jam baru |

---

## F-10 — Alur buka lagi gratis

| # | Kondisi | Sistem |
|---|---|---|
| 1 | Dalam 5 menit pertama sejak `startAt` | Tombol tampil |
| 2 | Sudah lewat 5 menit | Tombol hilang |
| 3 | Sudah dipakai sekali | Tombol hilang |
| 4 | Ditekan | Langsung tampilkan QR (tanpa Pickup/Finish), pintu buka 180 detik |
| 5 | Pintu ditutup | Sewa tetap berjalan dari `startAt` semula |

---

## F-11 — Alur pintu tidak ditutup (180 detik habis)

| # | Kondisi | Sistem |
|---|---|---|
| 1 | Pintu terbuka, pelanggan pergi | Hitung mundur 180 detik berjalan |
| 2 | Habis | Pintu menutup otomatis |
| 3 | Belum ada barang | Sewa **tidak** dimulai, status kembali `opening`, pesanan tetap sah |
| 4 | Sudah ada barang | Sewa dimulai dari waktu pintu tertutup |

**Catatan:** ini yang membuat aturan "sewa mulai saat pintu tertutup" bekerja
secara adil. Pelanggan yang membuka pintu lalu berubah pikiran tidak dihitung
sewa.

---

## F-12 — Alur koreksi setelah Finish (3 menit)

| # | Kondisi | Sistem |
|---|---|---|
| 1 | Pelanggan menekan Finish, pintu tertutup | Mulai jendela koreksi 3 menit |
| 2 | Dalam 3 menit, ada barang tertinggal | Tombol "Buka lagi" muncul, gratis, sekali |
| 3 | Lewat 3 menit | Dihitung kelebihan waktu dari `endAt` |

---

## Ringkasan transisi status

```
pending ──bayar──► (QR Titip) ──scan──► opening
opening ──tutup pintu──► active
opening ──barang tidak muat──► refund (selesai)
active ──tekan Pickup──► (QR Pickup)
active ──scan pickup, tepat waktu──► choice
active ──waktu habis──► late
choice ──Finish──► done
choice ──Keep──► active
late ──bayar + Finish──► done
late ──bayar + Keep──► active (endAt baru)
```

---

## Yang harus bisa diperagakan dalam 5 menit

Urutan demo yang disarankan:

1. Login + pilih lokasi/ukuran/durasi (30 detik)
2. Peragakan validasi jam operasional — coba 24 jam di mall, lihat penolakan (20 detik)
3. Bayar → QR Titip + kode jaga (20 detik)
4. Buka dengan **kode jaga** (bukan QR) — tunjukkan jalur cadangan (20 detik)
5. Tutup pintu → sewa aktif, tunjukkan hitung mundur (20 detik)
6. Majukan waktu +29 menit → pengingat 30 menit muncul (20 detik)
7. Majukan lagi → pengingat 10 dan 5 menit (30 detik)
8. Tambah durasi → jam berakhir berubah (30 detik)
9. Majukan melewati batas → denda berjalan (30 detik)
10. Pickup → bayar denda → Finish → ringkasan (60 detik)

Total ± 5 menit, dan seluruh aturan bisnis sudah terlihat.
