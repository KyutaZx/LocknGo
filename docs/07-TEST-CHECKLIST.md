# Test Checklist — LocknGo

Dipakai saat latihan sebelum presentasi. Jalankan berurutan, centang yang lolos.
Kalau ada yang gagal, catat di kolom kanan.

**Cara pakai:** buka `app.html`, tekan **Reset** dulu agar mulai dari nol.

---

## Bagian 1 — Halaman depan

- [ ] **T-01** `index.html` terbuka tanpa error di konsol
- [ ] **T-02** Semua bagian tampil: hero, masalah, cara pakai, ukuran, tarif, keamanan, FAQ, CTA, footer
- [ ] **T-03** Tabel tarif terisi 8 angka dengan benar (M: 35/55/80/120 · L: 50/75/110/150)
- [ ] **T-04** Klik FAQ membuka jawaban; klik lagi menutup; membuka satu menutup yang lain
- [ ] **T-05** Tombol "Pesan Sekarang" membuka `app.html`

## Bagian 2 — Login

- [ ] **T-06** Nomor `123` ditolak dengan pesan "Nomor belum benar"
- [ ] **T-07** Nomor `081234567890` diterima, kode OTP tampil di layar
- [ ] **T-08** Kode OTP salah ditolak, tetap di halaman yang sama
- [ ] **T-09** Kode OTP benar → masuk ke halaman pilih
- [ ] **T-10** Refresh halaman setelah login → tetap masuk (tidak kembali ke login)

## Bagian 3 — Pilih & validasi

- [ ] **T-11** Empat lokasi tampil dengan jumlah unit dan jam operasional
- [ ] **T-12** Memilih ukuran mengubah harga di daftar durasi
- [ ] **T-13** Tombol "Lanjut bayar" nonaktif sampai lokasi + ukuran + durasi + centang terpenuhi
- [ ] **T-14** Validasi jam operasional: pilih lokasi mall, coba durasi yang melewati jam tutup → ditolak dengan penjelasan
- [ ] **T-15** Lokasi akses 24 jam menerima semua durasi

## Bagian 4 — Bayar & QR Titip

- [ ] **T-16** Halaman bayar menampilkan QR, nominal, dan rincian yang benar
- [ ] **T-17** Klik ganda tombol bayar tidak membuat dua pesanan
- [ ] **T-18** Setelah bayar, QR Titip tampil beserta kode jaga 6 digit
- [ ] **T-19** Tombol "Batalkan & refund" mengembalikan 100% dan loker tetap tersedia

## Bagian 5 — Buka loker

- [ ] **T-20** Scan QR Titip → nomor loker muncul, pintu terbuka, hitung mundur 180 detik berjalan
- [ ] **T-21** **Kode jaga**: tekan "Pakai kode jaga", masukkan kode salah → ditolak
- [ ] **T-22** **Kode jaga**: masukkan kode benar → pintu terbuka, sama seperti scan QR
- [ ] **T-23** Tombol "Barang tidak muat — batalkan" → refund 100%, loker kembali tersedia
- [ ] **T-24** Menutup pintu memulai sewa; jam berakhir = sekarang + durasi

## Bagian 6 — Sewa aktif

- [ ] **T-25** Hitung mundur berjalan tiap detik dan sesuai jam berakhir
- [ ] **T-26** Refresh halaman saat sewa aktif → sewa tetap berjalan, hitung mundur benar
- [ ] **T-27** Majukan +29 menit → pengingat "Sisa 30 menit" muncul (sekali saja)
- [ ] **T-28** Majukan ke sisa 9 menit → pengingat "Sisa 10 menit" + warna kuning
- [ ] **T-29** Majukan ke sisa 4 menit → pengingat "Sisa 5 menit" + peringatan merah
- [ ] **T-30** Tambah durasi 1 jam → jam berakhir bertambah 1 jam, pengingat dijadwalkan ulang
- [ ] **T-31** Tambah durasi 3 jam → jam berakhir bertambah 3 jam
- [ ] **T-32** Tombol "Buka lagi" hanya muncul dalam 5 menit pertama, dan hanya sekali
- [ ] **T-33** Peta loker menandai unit milik sendiri dengan hijau
- [ ] **T-34** Log aktivitas mencatat setiap kejadian dengan jam yang benar

## Bagian 7 — Pickup

- [ ] **T-35** Tekan "Ambil barang" → QR pickup + kode jaga + hitung mundur 10 menit
- [ ] **T-36** Biarkan 10 menit (majukan waktu) → QR ditandai kedaluwarsa, scan ditolak
- [ ] **T-37** Scan QR pickup tepat waktu → pilihan Finish / Keep muncul
- [ ] **T-38** Finish tepat waktu → sewa selesai, ringkasan tampil, loker tersedia lagi
- [ ] **T-39** Keep saat waktu masih ada → kembali ke sewa aktif, jam berakhir tidak berubah
- [ ] **T-40** Setelah Finish, riwayat transaksi bertambah

## Bagian 8 — Denda

- [ ] **T-41** Majukan waktu melewati jam berakhir → layar sewa menampilkan status telat dan denda berjalan
- [ ] **T-42** Telat 3 menit → denda Rp5.000
- [ ] **T-43** Telat 7 menit → denda Rp10.000
- [ ] **T-44** Telat 12 menit → denda Rp15.000
- [ ] **T-45** Telat 31 menit → denda Rp35.000 (7 blok)
- [ ] **T-46** Telat lebih dari 24 jam → denda berhenti di Rp120.000
- [ ] **T-47** Nominal denda terkunci 5 menit; hitung mundur tampil
- [ ] **T-48** Pickup saat telat → layar denda muncul, pintu **belum** terbuka
- [ ] **T-49** Bayar denda → pintu terbuka, sewa selesai, total di ringkasan sudah termasuk denda
- [ ] **T-50** Pickup saat telat lalu pilih Keep → bayar denda + sewa 3 jam baru, kembali ke sewa aktif

## Bagian 9 — Responsif & aksesibilitas

- [ ] **T-51** Lebar 390px: tidak ada scroll horizontal, semua tombol mudah ditekan
- [ ] **T-52** Lebar 390px: tabel tarif berubah menjadi kartu bertumpuk (tidak terpotong)
- [ ] **T-53** Lebar 768px: tata letak dua kolom rapi
- [ ] **T-54** Lebar 1440px: tata letak penuh, tidak ada elemen melar berlebihan
- [ ] **T-55** QR tetap minimal 200px dan mudah dipindai di semua lebar
- [ ] **T-56** Bisa dioperasikan hanya dengan keyboard (Tab, Enter, Esc menutup modal)
- [ ] **T-57** Fokus keyboard terlihat jelas

## Bagian 10 — Ketahanan demo

- [ ] **T-58** Tombol Reset mengembalikan semuanya ke awal tanpa error
- [ ] **T-59** Panel demo bisa disembunyikan dan ditampilkan lagi
- [ ] **T-60** Seluruh alur utama selesai dalam waktu kurang dari 5 menit

---

## Catatan saat pengujian

| Tanggal | Penguji | Gagal di | Catatan |
|---|---|---|---|
| | | | |
| | | | |
| | | | |

---

## Urutan demo yang disarankan (5 menit)

1. Halaman depan — tunjukkan tarif dan cara pakai (40 detik)
2. Login → pilih lokasi, ukuran, durasi (30 detik)
3. **Tunjukkan validasi jam operasional** — coba 24 jam di mall (20 detik)
4. Bayar → QR Titip + kode jaga (20 detik)
5. **Buka dengan kode jaga**, bukan QR (25 detik)
6. Tutup pintu → sewa aktif (20 detik)
7. Majukan +29 menit → pengingat 30 menit (15 detik)
8. Majukan ke sisa 9 menit → pengingat 10 menit (15 detik)
9. Tambah durasi 1 jam (25 detik)
10. Majukan melewati batas → denda berjalan (20 detik)
11. Pickup → bayar denda → Finish (60 detik)
12. Tunjukkan riwayat dan dashboard (30 detik)

**Kalimat pembuka yang disarankan:**
> "LocknGo itu loker otomatis di mall dan stasiun. Yang membedakan: tidak ada
> layar pemesanan di lokasi, karena itu akan bikin antrean. Semua lewat HP
> pelanggan masing-masing — jadi ini web app, bukan sekadar website."
