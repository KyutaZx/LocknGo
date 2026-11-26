# PRD — LocknGo Web Prototype

**Versi:** 1.0
**Status:** Disetujui untuk dibangun
**Konteks:** Proyek Venture Creation Kelompok 3
**Jenis produk:** Prototipe web yang dapat diklik (bukan sistem produksi)

---

## 1. Ringkasan

LocknGo adalah layanan penitipan barang dengan loker otomatis di titik ramai
Surabaya. Pelanggan memesan dan membayar dari HP, lalu membuka loker sendiri
memakai QR atau kode jaga.

Dokumen ini mendefinisikan **prototipe web** yang memperagakan alur tersebut
dari awal sampai akhir, dengan data contoh dan tanpa uang sungguhan.

### Kenapa web, bukan layar di loker

Satu layar pemesanan di lokasi akan menciptakan antrean. Pelanggan stasiun dan
mall sering buru-buru. Dengan web app, tiap orang memesan dan membuka lokernya
sendiri dari HP masing-masing. Tab di loker cukup berfungsi sebagai pembaca QR.

**Konsekuensi:** web bukan pelengkap, tapi satu-satunya cara pelanggan memakai
layanan. Kalau web gagal, produk gagal.

---

## 2. Masalah

| Masalah | Dampak |
|---|---|
| Barang bawaan (koper, tas belanja, stroller) harus dibawa ke mana-mana | Belanja tidak nyaman, mobilitas turun |
| Penitipan di mall hanya di customer service, pakai rak, harus lewat petugas | Antre, terutama weekend dan long weekend |
| Tidak ada bukti serah-terima dan tidak jelas penanggung jawab | Pelanggan ragu menitipkan barang bernilai |
| Lokasi penitipan tidak tersedia di titik transit | Wisatawan dan penumpang kesulitan |

**Bukti lapangan:** wawancara dengan petugas keamanan mall menyebut tiga
kekhawatiran utama — barang berbahaya, tanggung jawab bila hilang, dan biaya
petugas. Ketiganya dijawab di bagian Keamanan dan Syarat & Ketentuan.

---

## 3. Pengguna

### Persona 1 — Wisatawan transit
- Datang ke Surabaya naik kereta, lanjut jalan-jalan sebelum check-in
- Bawa koper 24–28 inci, butuh 3–6 jam
- **Kebutuhan:** loker Large, dekat stasiun, bisa pesan sebelum turun

### Persona 2 — Pembelanja banyak
- Belanja di mall, tangan penuh paper bag
- Butuh 3–6 jam, ukuran Medium sampai Large
- **Kebutuhan:** loker di dalam mall, dekat area belanja

### Persona 3 — Jastiper
- Membawa banyak tas pesanan, butuh berpindah-pindah
- Butuh 6–12 jam, ukuran Large
- **Kebutuhan:** bisa ambil sebagian (Keep), tambah durasi

### Persona 4 — Pengunjung event
- Datang ke pameran atau konser dengan tas dan stroller
- Butuh 6–12 jam, ukuran Large
- **Kebutuhan:** proses cepat, tidak mau antre

### Persona 5 — Pengelola / petugas (sekunder)
- Memantau loker, menangani gangguan, mengamankan barang terlantar
- **Kebutuhan:** melihat status semua unit dan log aktivitas

---

## 4. Ruang lingkup

### Termasuk (v1 prototipe)

1. Halaman penjelasan produk: masalah, cara pakai, ukuran, tarif, keamanan, FAQ
2. Login nomor HP dengan OTP (disimulasikan)
3. Pemilihan lokasi, ukuran, dan durasi dengan validasi ketersediaan
4. Validasi jam operasional lokasi terhadap jam berakhir sewa
5. Persetujuan daftar barang terlarang
6. Pembayaran QRIS (disimulasikan)
7. QR Titip + kode jaga 6 digit
8. Simulasi scan di tab loker, pintu terbuka 180 detik
9. Tombol "barang tidak muat" saat pintu terbuka (refund penuh)
10. Sewa aktif: hitung mundur, pengingat 30/10/5 menit, log aktivitas
11. Tambah durasi sebelum sewa berakhir
12. Buka lagi gratis satu kali dalam 5 menit pertama
13. Pickup: QR baru berlaku 10 menit + kode jaga
14. Pilihan Finish / Keep, termasuk kasus Keep saat waktu habis
15. Perhitungan denda kelebihan waktu per 5 menit, dibulatkan ke atas
16. Pembayaran denda sebelum pintu terbuka
17. Refund 100% untuk pembatalan sebelum barang disimpan
18. Riwayat transaksi
19. Dashboard operasional ringkas: status unit, log, ringkasan pendapatan
20. Panel demo untuk memajukan jam virtual

### Tidak termasuk (v1)

- Backend, database server, autentikasi nyata
- Integrasi QRIS sungguhan
- Perangkat keras loker, sensor, kamera
- Notifikasi push/WhatsApp/email sungguhan
- Aplikasi native Android/iOS
- Multi-bahasa
- Sistem pembayaran, refund, dan pajak yang sebenarnya
- Analisis bisnis, proyeksi keuangan, dan BMC (dokumen terpisah)

---

## 5. User story

### US-01 — Masuk
**Sebagai** pelanggan, **saya ingin** masuk dengan nomor HP dan kode OTP,
**supaya** pesanan saya tercatat atas nama saya.

**Kriteria terima**
- Nomor tidak valid (bukan 08, kurang dari 10 digit) → pesan kesalahan jelas, tidak lanjut
- Kode OTP ditampilkan di layar untuk keperluan demo
- Kode salah → pesan kesalahan, tetap di halaman yang sama
- Kode benar → masuk, sesi tersimpan meski halaman dimuat ulang

### US-02 — Pilih lokasi
**Sebagai** pelanggan, **saya ingin** melihat lokasi beserta jumlah loker tersedia,
**supaya** saya tidak memesan di tempat yang penuh.

**Kriteria terima**
- Setiap lokasi menampilkan jumlah unit tersedia dan jam operasional
- Lokasi dengan 0 unit tersedia tidak bisa dipilih
- Pilihan lokasi tersimpan saat berpindah langkah

### US-03 — Pilih ukuran
**Sebagai** pelanggan, **saya ingin** melihat dimensi dan contoh barang yang muat,
**supaya** saya tidak salah pilih ukuran.

**Kriteria terima**
- Medium: 53 × 53 × 38 cm, ±107 L, ransel / 2–3 paper bag
- Large: 53 × 53 × 83 cm, ±233 L, koper 28 inci / 4–6 shopping bag / stroller
- Ukuran terpilih memengaruhi harga yang tampil di langkah durasi

### US-04 — Pilih durasi dengan validasi jam operasional
**Sebagai** pelanggan, **saya ingin** sistem mencegah saya memilih durasi yang
melewati jam tutup lokasi, **supaya** saya tidak terjebak tidak bisa mengambil barang.

**Kriteria terima**
- Durasi 3 / 6 / 12 / 24 jam tersedia
- Jika jam berakhir melewati jam tutup lokasi → opsi ditandai tidak tersedia
- Muncul penjelasan: "Mall tutup 22.00. Pilih durasi maksimal X jam, atau gunakan lokasi akses 24 jam."
- Lokasi akses 24 jam tidak terkena batasan ini
- Total harga terupdate otomatis

### US-05 — Setujui barang terlarang
**Sebagai** penyedia, **saya ingin** pelanggan menyatakan tidak menyimpan barang
terlarang, **supaya** tanggung jawab hukum jelas.

**Kriteria terima**
- Daftar barang terlarang tampil lengkap
- Tombol "Lanjut bayar" nonaktif sampai kotak persetujuan dicentang
- Persetujuan tercatat di data pesanan

### US-06 — Bayar
**Sebagai** pelanggan, **saya ingin** membayar dengan QRIS dan langsung mendapat
QR Titip, **supaya** saya bisa segera menuju loker.

**Kriteria terima**
- Halaman pembayaran menampilkan QR, nominal, dan rincian pesanan
- Menekan "Simulasikan pembayaran berhasil" menghasilkan QR Titip
- Klik ganda tidak membuat dua pesanan
- Ada opsi batalkan dengan refund 100% sebelum barang disimpan

### US-07 — Buka loker dengan QR
**Sebagai** pelanggan, **saya ingin** membuka loker dengan memindai QR,
**supaya** saya bisa menyimpan barang tanpa bantuan petugas.

**Kriteria terima**
- QR Titip sekali pakai
- Setelah scan, nomor loker ditampilkan dan pintu terbuka
- Hitung mundur 180 detik tampil
- Menutup pintu memulai hitungan sewa; sebelum itu sewa belum berjalan

### US-08 — Buka loker dengan kode jaga
**Sebagai** pelanggan dengan kamera rusak atau QR sulit terbaca, **saya ingin**
mengetik kode 6 digit, **supaya** saya tetap bisa membuka loker.

**Kriteria terima**
- Kode jaga tampil di halaman QR Titip dan QR Pickup
- Ada tombol "Kamera tidak bisa membaca? Pakai kode jaga"
- Kode salah → pesan kesalahan, boleh coba lagi
- Kode benar → pintu terbuka, sama seperti scan QR
- Kode sekali pakai; setelah dipakai tidak berlaku lagi

### US-09 — Barang tidak muat
**Sebagai** pelanggan yang barangnya ternyata tidak muat, **saya ingin**
membatalkan tanpa kehilangan uang, **supaya** saya tidak dirugikan.

**Kriteria terima**
- Saat pintu terbuka, ada tombol "Barang tidak muat — batalkan"
- Ditekan → refund 100%, loker kembali tersedia, sewa tidak pernah mulai
- Konfirmasi ditampilkan sebelum membatalkan

### US-10 — Sewa aktif
**Sebagai** pelanggan, **saya ingin** melihat sisa waktu dan pengingat,
**supaya** saya tidak telat.

**Kriteria terima**
- Hitung mundur berjalan tiap detik
- Warna berubah: normal → kuning (<10 menit) → merah (<5 menit) → merah (+)
- Pengingat muncul pada 30, 10, dan 5 menit sebelum habis, masing-masing sekali
- Log aktivitas mencatat setiap kejadian
- Halaman bertahan setelah refresh

### US-11 — Tambah durasi
**Sebagai** pelanggan yang masih butuh waktu, **saya ingin** memperpanjang,
**supaya** saya tidak kena denda.

**Kriteria terima**
- Pilihan 1 jam dan 3 jam dengan harga sesuai ukuran
- Jam berakhir baru = jam berakhir lama + tambahan
- Pengingat dijadwalkan ulang dari jam baru
- Tidak bisa dipakai setelah sewa berakhir
- Harga perpanjangan selalu lebih murah dari denda telat setara

### US-12 — Buka lagi gratis
**Sebagai** pelanggan yang lupa memasukkan sesuatu, **saya ingin** membuka
sekali lagi tanpa biaya, **supaya** saya tidak perlu mengulang pesanan.

**Kriteria terima**
- Hanya tersedia dalam 5 menit pertama sejak pintu tertutup
- Hanya sekali
- Tidak perlu memilih Pickup / Finish, tidak perlu bayar
- Setelah dipakai, tombol hilang

### US-13 — Pickup
**Sebagai** pelanggan, **saya ingin** mengambil barang dengan QR baru,
**supaya** orang lain tidak bisa membuka loker saya.

**Kriteria terima**
- QR baru dibuat saat menekan "Ambil barang"
- Berlaku 10 menit, sekali pakai
- Hitung mundur 10 menit tampil
- Kedaluwarsa → QR ditandai tidak berlaku dan harus dibuat ulang
- Kode jaga tersedia sebagai alternatif

### US-14 — Finish / Keep
**Sebagai** pelanggan, **saya ingin** memilih selesai atau ambil sebagian,
**supaya** saya tidak perlu membayar ulang bila hanya mengambil sebagian.

**Kriteria terima**
- Finish tepat waktu → pintu terbuka tanpa biaya tambahan, sewa selesai
- Keep saat waktu masih ada → pintu terbuka, sewa lanjut sampai jam berakhir
- Keep saat waktu habis → bayar denda + sewa baru 3 jam dalam satu pembayaran
- Pemberitahuan bahwa sisa waktu tidak dikembalikan muncul sebelum Finish

### US-15 — Denda kelebihan waktu
**Sebagai** penyedia, **saya ingin** denda dihitung otomatis dan adil,
**supaya** tidak ada sengketa.

**Kriteria terima**
- Dihitung saat QR/kode pickup dipindai, bukan saat tombol ditekan
- Rp5.000 per 5 menit, dibulatkan ke atas
- Contoh: 1–5 menit = Rp5.000; 6–10 = Rp10.000; 11–15 = Rp15.000
- Total denda dibatasi Rp120.000 per 24 jam
- Batas 48 jam → barang diamankan petugas
- Nominal dikunci 5 menit sejak tagihan muncul
- Pintu terbuka hanya setelah pembayaran berhasil

### US-16 — Dashboard operasional
**Sebagai** petugas, **saya ingin** melihat status semua loker,
**supaya** saya bisa menangani masalah dengan cepat.

**Kriteria terima**
- Daftar unit per lokasi dengan status: tersedia / terisi / terlambat / offline
- Log aktivitas terbaru
- Ringkasan: jumlah sewa aktif, pendapatan hari ini, unit terisi

---

## 6. Aturan bisnis

### Tarif

| Ukuran | 3 jam | 6 jam | 12 jam | 24 jam |
|---|---|---|---|---|
| Medium | 35.000 | 55.000 | 80.000 | 120.000 |
| Large | 50.000 | 75.000 | 110.000 | 150.000 |

### Tambah durasi

| Tambahan | Medium | Large |
|---|---|---|
| 1 jam | 15.000 | 20.000 |
| 3 jam | 35.000 | 50.000 |

Prinsip: perpanjangan selalu lebih murah daripada telat (denda setara
Rp60.000/jam), supaya pelanggan memilih memperpanjang.

### Kelebihan waktu

- Rp5.000 per blok 5 menit, dibulatkan ke atas
- Batas total denda Rp120.000 per 24 jam
- Batas 48 jam sebelum barang diamankan, disimpan 30 hari
- Tidak ditagih bila gangguan berasal dari sistem (loker offline, QR gagal,
  pembayaran tertunda), dan dicatat di log

### Waktu

- Sewa mulai saat pintu tertutup dengan barang di dalamnya
- Selesai lebih awal tidak mengembalikan sisa waktu
- Pintu terbuka menunggu 180 detik
- Buka lagi gratis: sekali, dalam 5 menit pertama
- Koreksi setelah Finish: 3 menit, satu kali, tanpa denda
- QR pickup berlaku 10 menit
- Tidak ada toleransi telat

### Booking dari jauh

- Maksimal 1 jam sebelum kedatangan
- Loker ditahan 30 menit setelah jam kedatangan, bisa diperpanjang 10 menit sekali, gratis
- Batal ≥2 jam sebelum kedatangan: refund 100%
- Batal <2 jam atau tidak datang: refund 50%, reservasi hangus

---

## 7. Kriteria keberhasilan prototipe

Prototipe dianggap berhasil bila:

1. Seluruh alur utama bisa diselesaikan tanpa penjelasan lisan
2. Penguji dapat mencoba sendiri di HP maupun laptop
3. Semua aturan di bagian 6 dapat diperagakan dalam waktu < 5 menit
4. Tidak ada jalan buntu: setiap layar punya langkah keluar
5. Data tidak hilang saat halaman dimuat ulang
6. Tampilan tidak rusak pada lebar 390px, 768px, dan 1440px

---

## 8. Asumsi

Asumsi berikut dipakai karena dokumen sumber belum menetapkannya. Semua
dapat diubah di satu tempat pada kode (`js/data.js`).

1. Harga tambah durasi (1 jam, 3 jam)
2. Batas total denda Rp120.000 per 24 jam
3. Lokasi, jumlah unit, dan jam operasional
4. Batas ganti rugi: 10× tarif sewa atau Rp1.000.000, mana yang lebih rendah
5. Nama lokasi bersifat fiktif untuk keperluan akademik
