# Operasional & Kebijakan — LocknGo

Dokumen ini menjawab pertanyaan yang **tidak bisa diperagakan di prototipe**
tetapi hampir pasti ditanyakan saat presentasi. Isinya kebijakan, bukan kode.

---

## 1. Listrik mati

**Prinsip:** barang tetap aman, pelanggan tetap bisa mengambil.

| Lapis | Fungsi | Ketahanan |
|---|---|---|
| UPS di tab loker | Menjaga tab, jaringan, dan server lokal tetap hidup | ± 4 jam |
| Baterai cadangan di setiap kunci | Pintu tetap bisa dibuka walau listrik utama mati | ± 12 jam |
| Mode offline | Tab loker menyimpan daftar QR/kode sah secara lokal | Selama UPS hidup |
| Kunci master fisik | Dipegang petugas, dipakai setelah verifikasi identitas | — |
| Pencatatan lokal | Semua transaksi dicatat, disinkronkan saat jaringan pulih | — |

**Yang tidak boleh terjadi:** pintu terbuka otomatis saat listrik mati. Itu
bencana keamanan, bukan solusi.

**Prosedur petugas**
1. Pastikan UPS menyala dan tab loker masih berfungsi
2. Bila tab mati, gunakan kunci master satu per satu
3. Verifikasi identitas: KTP + nomor HP yang cocok dengan data sewa
4. Catat di log manual: waktu, nomor loker, nama, nomor HP
5. Setelah listrik pulih, cocokkan log manual dengan data sistem

---

## 2. Internet mati

| Kondisi | Penanganan |
|---|---|
| Internet di lokasi mati, listrik hidup | Tab loker masuk mode offline; verifikasi QR/kode dari cache lokal |
| Pelanggan tidak punya sinyal | QR/kode tetap bisa ditunjukkan (sudah tampil di layar, tidak perlu internet) |
| Internet pulih | Data offline disinkronkan otomatis, konflik diselesaikan berdasarkan waktu |
| Gagal sinkron | Transaksi ditandai `perlu_verifikasi`, petugas memeriksa manual |

**Catatan penting untuk presentasi:** pelanggan **tidak** membutuhkan internet
saat membuka loker — QR dan kode jaga sudah ada di layar HP. Yang butuh
jaringan hanya tab loker, dan itu pun punya mode offline.

---

## 3. Barang hilang atau rusak

### Batas ganti rugi

> Maksimal **10× tarif sewa**, atau **Rp1.000.000** — mana yang lebih rendah.

Contoh: sewa Medium 3 jam (Rp35.000) → ganti rugi maksimal Rp350.000.

### Syarat klaim

1. Lapor maksimal **1 × 24 jam** sejak sewa selesai
2. Menunjukkan bukti sewa (nomor pesanan atau nomor HP)
3. Mengisi formulir keterangan barang
4. Bersedia diperiksa lewat rekaman CCTV dan log

### Tidak ditanggung

- Uang tunai, perhiasan, dokumen berharga
- Barang bernilai di atas Rp5.000.000
- Barang yang masuk daftar terlarang
- Kerugian akibat pelanggan lalai: pintu tidak ditutup, kode dibagikan ke orang lain
- Kerusakan yang sudah ada sebelum disimpan

### Alat bukti

| Alat | Kegunaan |
|---|---|
| CCTV | Merekam siapa membuka loker dan kapan |
| Sensor pintu | Membuktikan pintu tertutup atau tidak |
| Sensor isi | Membuktikan loker kosong atau berisi |
| Log sistem | Mencatat setiap QR/kode yang dipakai, waktu, dan hasilnya |

**Kalimat untuk presentasi:**
> "Kami tidak bisa menjanjikan mengganti koper berisi barang senilai sepuluh
> juta, karena tarif kami Rp35.000. Yang kami jamin: ada batas ganti rugi yang
> jelas, ada bukti elektronik, dan ada prosedur klaim yang bisa ditelusuri.
> Itu yang membedakan kami dari menitipkan di rak customer service."

---

## 4. Barang terlarang ditemukan

| Tahap | Tindakan |
|---|---|
| Terdeteksi saat penyimpanan | Pintu tidak dibuka; petugas dihubungi |
| Terdeteksi setelah tersimpan | Sewa dihentikan, barang diamankan, pelanggan dihubungi |
| Pelanggan tidak merespons 3 × 24 jam | Barang diserahkan ke pihak berwenang |
| Biaya penanganan | Dibebankan ke pelanggan sesuai syarat dan ketentuan |

---

## 5. Barang terlantar (>48 jam)

1. Hari ke-0 sampai 48 jam: tarif kelebihan berjalan, pengingat berkala dikirim
2. Lewat 48 jam: petugas membuka loker, mencatat isi, memindahkan ke gudang
3. Barang disimpan **30 hari**
4. Pengingat dikirim pada hari ke-3, 7, 14, dan 28
5. Lewat 30 hari: barang menjadi milik pengelola sesuai ketentuan, atau disumbangkan

**Catatan:** masa simpan 30 hari di dokumen sumber tertulis untuk kasus
kelebihan waktu, sedangkan kasus "pelanggan tidak kembali" tertulis 14 hari.
Dokumen ini memakai **30 hari** untuk keduanya agar konsisten — perlu
dikonfirmasi ke dosen bila ada ketentuan khusus.

---

## 6. Gangguan sistem

Bila kelebihan waktu terjadi karena kesalahan sistem, denda **tidak ditagih**.

| Gangguan | Penanganan |
|---|---|
| Loker offline saat pelanggan mau ambil | Petugas buka manual, denda dibatalkan |
| QR gagal terbaca berulang | Gunakan kode jaga; bila tetap gagal, buka manual |
| Pembayaran tertunda dari sisi penyedia | Waktu tunggu tidak dihitung sebagai kelebihan |
| Kesalahan hitung | Dikoreksi, selisih dikembalikan |

Setiap gangguan **wajib dicatat di log** dengan waktu dan penyebab.

---

## 7. Kebijakan pembatalan

| Situasi | Refund | Catatan |
|---|---|---|
| Batal sebelum barang disimpan | 100% | Loker tidak pernah dipakai |
| Barang tidak muat | 100% | Lewat tombol di layar pintu terbuka |
| Batal ≥2 jam sebelum jam kedatangan | 100% | Reservasi dilepas |
| Batal <2 jam sebelum kedatangan | 50% | Reservasi hangus |
| Tidak datang (lewat masa tahan) | 50% | Reservasi hangus |
| Gangguan sistem | 100% | Dicatat di log |

**Waktu proses refund:** 1–7 hari kerja ke metode pembayaran semula.

---

## 8. Pertanyaan yang sering ditanyakan penguji

**"Kalau listrik mati, pintu kebuka semua?"**
> Tidak. Pintu tetap terkunci. Ada UPS dan baterai cadangan, dan petugas bisa
> membuka satu per satu setelah verifikasi identitas. Membuka semua pintu saat
> listrik mati justru bencana keamanan.

**"Kalau barang hilang, ganti berapa?"**
> Maksimal 10× tarif sewa atau Rp1.000.000, mana yang lebih rendah. Dengan
> syarat lapor maksimal 24 jam. Barang di atas Rp5 juta tidak boleh disimpan.

**"Kenapa tidak ada layar di loker?"**
> Karena satu layar akan membuat antrean. Pelanggan stasiun sering buru-buru.
> Dengan web app, tiap orang membuka lokernya sendiri dari HP. Tab di loker
> cukup jadi pembaca QR.

**"Bedanya dengan menitip di customer service?"**
> Tiga hal: tidak perlu antre, ada bukti elektronik (QR, log, CCTV), dan
> waktunya jelas dengan pengingat otomatis.

**"Kenapa pelanggan mau bayar Rp35.000?"**
> Karena alternatifnya membawa koper ke mana-mana sepanjang hari. Untuk
> wisatawan transit, itu sepadan. Untuk pembelanja, itu lebih murah daripada
> pulang dulu.

**"Apa yang terjadi kalau HP saya mati?"**
> Sewa tetap berjalan. Setelah HP menyala, login dengan nomor yang sama, dan
> sewa muncul kembali lengkap dengan kode jaga. Kalau HP benar-benar tidak bisa
> dipakai, petugas bisa membuka dengan verifikasi KTP.

**"Ini sudah ada di mall Surabaya?"**
> Belum. Hasil wawancara dengan petugas keamanan mall menunjukkan belum ada
> layanan ini, dan beberapa pengunjung pernah menanyakan. Kekhawatiran utama
> mereka: barang berbahaya, tanggung jawab bila hilang, dan biaya petugas.
> Ketiganya sudah kami jawab di bagian keamanan dan syarat ketentuan.
