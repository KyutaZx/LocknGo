# Catatan Keputusan — LocknGo

Format tiap butir: **masalah → keputusan → alasan → konsekuensi**.
Semua butir di bawah berasal dari celah pada dokumen Venture Creation
Kelompok 3, atau dari pertanyaan yang pasti muncul saat presentasi.

---

## D-01 — Harga tambah durasi

**Masalah.** Dokumen punya baris "1 Jam" dan "3 jam" untuk Medium dan Large,
tetapi harganya kosong. Tanpa angka, fitur perpanjangan tidak bisa dijalankan.

**Keputusan.**

| Tambahan | Medium | Large |
|---|---|---|
| 1 jam | Rp15.000 | Rp20.000 |
| 3 jam | Rp35.000 | Rp50.000 |

**Alasan.** Dokumen sendiri menetapkan prinsip: *"Memperpanjang sebelum habis
selalu sama murahnya atau lebih murah daripada telat. Itu sengaja, supaya
pelanggan memilih menambah durasi."* Denda telat setara Rp60.000/jam. Dengan
angka di atas, perpanjangan selalu di bawah itu. Tambahan 3 jam Medium
(Rp35.000) sama dengan tarif paket 3 jam Medium — konsisten dan mudah dijelaskan.

**Konsekuensi.** Pendapatan per jam dari perpanjangan lebih rendah daripada
paket awal. Ini disengaja: tujuannya menjaga loker tetap berputar, bukan
memaksimalkan pendapatan dari pelanggan yang telat.

---

## D-02 — Denda 30 menit Rp120.000

**Masalah.** Tabel denda menulis: 1–5 menit Rp5.000; 6–10 menit Rp10.000;
11–15 menit Rp15.000; **30 menit Rp120.000**. Angka terakhir tidak mengikuti
pola. Dengan Rp5.000 per 5 menit, 30 menit seharusnya Rp30.000.

**Keputusan.** Rp120.000 dijadikan **batas maksimal denda per 24 jam**,
bukan tarif untuk 30 menit. Denda berjalan tetap Rp5.000 per 5 menit,
dibatasi maksimal Rp120.000 per 24 jam.

**Alasan.** Angka Rp120.000 bukan angka acak — itu persis tarif paket 24 jam
Medium. Kemungkinan besar maksud aslinya adalah batas atas. Menjadikannya
batas maksimal membuat tabel konsisten dan tetap mempertahankan angka tersebut.
Selain itu, tanpa batas atas, pelanggan yang meninggalkan barang 40 jam akan
ditagih Rp2.400.000 — angka yang tidak realistis dan tidak akan pernah dibayar.

**Konsekuensi.** Perlu satu baris tambahan di syarat dan ketentuan:
"Denda kelebihan waktu dibatasi Rp120.000 per 24 jam."

---

## D-03 — Loker di mall tetapi sewa 24 jam

**Masalah.** Mall tutup pukul 22.00. Pelanggan yang memesan 24 jam pada pukul
20.00 harus mengambil barang keesokan pukul 20.00 — tetapi ia tidak bisa
masuk ke mall. Ini konflik antara produk dan lokasi, bukan sekadar angka tarif.

**Keputusan.** Dua jenis penempatan:

1. **Loker dalam area mall** — hanya menerima pesanan yang jam berakhirnya
   masih sebelum jam tutup lokasi.
2. **Loker akses 24 jam** — ditempatkan di area yang tidak dikunci saat mall
   tutup (lobi parkir, dekat pintu masuk utama), khusus melayani 12 dan 24 jam.

Sistem **menolak** pesanan yang melanggar aturan ini, dengan pesan:
*"Mall tutup pukul 22.00. Pilih durasi maksimal X jam, atau gunakan lokasi
akses 24 jam."*

**Alasan.** Menolak di awal jauh lebih baik daripada membiarkan pelanggan
membayar lalu tidak bisa mengambil barangnya. Ini juga memperlihatkan bahwa
kalian memikirkan operasional, bukan hanya tampilan.

**Konsekuensi.** Di prototipe, setiap lokasi punya atribut `open` (jam
operasional) dan `alwaysOpen` (boolean). Validasi dijalankan di langkah
pemilihan durasi. Untuk demo, satu lokasi dibuat `alwaysOpen` agar penguji
bisa mencoba kedua skenario.

---

## D-04 — Listrik atau internet mati

**Masalah.** Sudah tercatat sebagai risiko, tetapi belum ada solusi. Ini
pertanyaan klasik: kalau mati lampu, pintu terbuka semua atau tetap terkunci?

**Keputusan.** Lima lapis, berurutan:

1. **UPS** menopang tab loker dan jaringan ±4 jam.
2. **Baterai cadangan di setiap kunci pintu** — pintu tetap dapat dibuka
   walau listrik utama mati.
3. **Mode offline** — tab loker menyimpan daftar QR/kode sah secara lokal,
   verifikasi tetap berjalan tanpa internet.
4. **Kunci master fisik** dipegang petugas, hanya dipakai setelah verifikasi
   identitas (KTP + nomor HP yang cocok).
5. **Pencatatan lokal** semua transaksi offline, disinkronkan saat jaringan
   kembali.

**Alasan.** Prinsipnya: barang harus tetap aman, tetapi pelanggan harus tetap
bisa mengambil. Pintu **tidak** boleh terbuka otomatis saat listrik mati —
itu bencana keamanan. Sebaliknya, pelanggan tidak boleh terkunci dari
barangnya sendiri.

**Konsekuensi.** Biaya per unit naik (UPS, baterai, kunci master). Ini masuk
komponen biaya operasional di dokumen bisnis, bukan di web.

---

## D-05 — Batas tanggung jawab bila barang hilang

**Masalah.** Dokumen menyebut petugas mengamankan barang, tetapi tidak
menetapkan angka ganti rugi. Ini justru keberatan utama pihak mall.

**Keputusan.**

- Ganti rugi maksimal **10× tarif sewa, atau Rp1.000.000 — mana yang lebih rendah**
- Wajib lapor maksimal **1 × 24 jam** sejak sewa selesai
- **Tidak berlaku** untuk: uang tunai, perhiasan, dokumen berharga, barang
  bernilai di atas Rp5.000.000 (semua sudah masuk daftar barang terlarang)
- **Tidak berlaku** bila pelanggan lalai: pintu tidak ditutup, kode dibagikan,
  atau barang terlarang disimpan
- CCTV, sensor, dan log menjadi alat bukti

**Alasan.** Angka 10× cukup untuk menutup kerugian wajar (koper, tas, pakaian)
tetapi membatasi eksposur pada nilai yang bisa dikelola. Menolak klaim barang
di atas Rp5.000.000 melindungi bisnis dari klaim yang tidak sebanding dengan
tarif Rp35.000–150.000. Syarat pelaporan 24 jam memberi kesempatan menelusuri
rekaman sebelum hilang.

**Konsekuensi.** Harus ditulis jelas di syarat dan ketentuan, dan pelanggan
mencentang persetujuan sebelum membayar.

---

## D-06 — Loker penuh atau barang tidak muat

**Masalah.** Dua kasus berbeda: (a) pelanggan sudah bayar tetapi tidak ada unit
tersedia; (b) barang ternyata tidak masuk ke loker.

**Keputusan.**

**(a) Loker penuh**
- Ketersediaan diperiksa **saat memilih lokasi**, bukan saat membayar
- Jumlah unit tersedia ditampilkan di daftar lokasi
- Lokasi dengan 0 unit tidak bisa dipilih (tombol nonaktif)
- Bila tetap terjadi bentrok saat scan, pembayaran dilepas penuh otomatis

**(b) Barang tidak muat**
- Saat pintu terbuka (180 detik), tersedia tombol
  **"Barang tidak muat — batalkan"**
- Ditekan → refund 100%, loker kembali tersedia, sewa tidak pernah dimulai
- Konfirmasi ditampilkan lebih dulu

**Alasan.** Jangan pernah menagih uang sebelum loker benar-benar terisi.
Kasus (b) diselesaikan dengan memanfaatkan jendela 180 detik yang sudah ada —
tidak perlu proses klaim terpisah, tidak perlu petugas, tidak ada sengketa.

**Konsekuensi.** Perlu tombol tambahan di layar pintu terbuka, dan satu status
transaksi baru: `refund` dengan alasan "barang tidak muat".

---

## D-07 — Kode jaga sebagai jalur kedua

**Masalah.** Dokumen hanya menyebut QR. Bila kamera HP rusak, layar retak,
atau QR sulit terbaca karena goresan/kotoran, pelanggan tidak bisa membuka
lokernya sama sekali.

**Keputusan.** Setiap QR disertai **kode jaga 6 digit**:

- Ditampilkan di halaman QR Titip dan QR Pickup
- Di tab loker tersedia dua cara: pindai QR, atau ketik kode
- Kode **sekali pakai**, terikat ke nomor loker, sama amannya dengan QR
- Tombol jelas: *"Kamera tidak bisa membaca? Pakai kode jaga"*

**Alasan.** Ini menutup skenario kegagalan paling realistis tanpa menambah
perangkat keras. Karena kode tetap sekali pakai dan terikat ke satu loker,
tidak ada penurunan keamanan yang berarti.

**Konsekuensi.** Kode jaga harus tersimpan di data sewa, dan ditandai sudah
dipakai setelah digunakan. Di prototipe, kode ditampilkan di layar untuk
keperluan demo.

---

## D-08 — Pilihan teknologi

**Masalah.** Perlu memilih antara statis (HTML/CSS/JS) atau framework
(React/Next.js) untuk prototype yang akan diklik sendiri oleh penguji.

**Keputusan.** Statis, tanpa build step, dengan `localStorage` sebagai
penyimpanan.

**Alasan.**

| Faktor | Statis | Next.js + DB |
|---|---|---|
| Dibuka dengan klik dua kali | Ya | Tidak |
| Dikirim sebagai ZIP | Langsung jalan | Perlu setup |
| Risiko gagal saat presentasi | Hampir nol | Server/DB bisa mati |
| Waktu pengerjaan | 1× | 2–3× |

Karena penilaian berfokus pada kejelasan alur, bukan kerumitan teknis,
pilihan statis memberi hasil terbaik dengan risiko terendah.

**Konsekuensi.** Data hanya tersimpan di satu browser. Ini disebut terbuka
saat presentasi sebagai batasan prototipe, bukan kelemahan yang disembunyikan.
Struktur lapisan dibuat agar migrasi ke backend hanya mengganti `Store`.

---

## D-09 — Jam virtual untuk demo

**Masalah.** Aturan waktu (pengingat 30/10/5 menit, denda per 5 menit, batas
48 jam) mustahil diperagakan dalam presentasi 10 menit bila memakai waktu nyata.

**Keputusan.** Panel demo dengan tombol maju waktu: +1 menit, +5 menit,
+30 menit, +1 jam, +3 jam. Semua perhitungan memakai `Time.now()` yang
menambahkan `offset`.

**Alasan.** Tanpa ini, bagian paling menarik dari produk — denda bertingkat,
pengingat, perpanjangan — tidak akan pernah terlihat oleh penguji. Dengan ini,
seluruh aturan bisa diperagakan dalam hitungan detik.

**Konsekuensi.** Panel demo harus bisa disembunyikan agar tidak mengganggu
tampilan saat dinilai estetikanya.

---

## D-10 — Nama lokasi

**Masalah.** Memakai nama mall sungguhan berisiko: terkesan mengklaim kerja
sama yang belum ada.

**Keputusan.** Nama lokasi bersifat fiktif, dengan penanda "prototipe" di footer.
Nama dapat diganti di satu tempat (`js/data.js`).

**Alasan.** Aman secara akademik dan etik, tanpa mengurangi kualitas demo.
Bila dosen meminta nama sungguhan, cukup ubah satu file.

**Konsekuensi.** Lokasi di prototipe: Tunjungan Plaza 1, Galaxy Mall 3,
Pakuwon Mall, Stasiun Gubeng — dengan catatan bahwa hubungan komersial belum ada.

---

## D-11 — Batas ganti rugi dan barang bernilai

**Masalah.** Pelanggan mungkin menyimpan laptop, kamera, atau barang bernilai
tinggi. Bila hilang, nilai klaim bisa jauh melebihi pendapatan.

**Keputusan.** Barang bernilai di atas Rp5.000.000 dilarang. Batas ganti rugi
10× tarif atau Rp1.000.000, mana yang lebih rendah.

**Alasan.** Melindungi bisnis sekaligus memberi kepastian kepada pelanggan.
Bila pelanggan butuh menyimpan barang bernilai tinggi, itu bukan segmen
layanan ini — dan lebih jujur dinyatakan di depan.

**Konsekuensi.** Perlu dinyatakan di daftar barang terlarang (sudah ada) dan
di syarat dan ketentuan.

---

## Ringkasan asumsi yang perlu dikonfirmasi dosen

| No | Asumsi | Dampak bila salah |
|---|---|---|
| D-01 | Harga tambah durasi | Perlu ubah 4 angka di `data.js` |
| D-02 | Batas denda Rp120.000/24 jam | Perlu ubah 1 angka |
| D-03 | Lokasi akses 24 jam | Perlu ubah atribut lokasi |
| D-05 | Batas ganti rugi 10× / Rp1 juta | Perlu ubah teks S&K |
| D-10 | Nama lokasi fiktif | Perlu ubah daftar lokasi |
