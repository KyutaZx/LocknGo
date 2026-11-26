# Naskah voice over Lock&Go (Bahasa Indonesia)

Gaya suara: perempuan, lembut, tempo tenang, ramah (bukan suara iklan yang menggebu).
Tulis "Lock and Go" agar dilafalkan benar. Satu baris = satu file mp3.
Batas durasi = ruang tersedia sebelum adegan berikutnya, jadi jangan lebih panjang.

| File | Mulai (dtk) | Maks | Naskah |
|---|---|---|---|
| 01.mp3 | 0,2 | 5,0 | Setiap perjalanan punya tujuan. Tapi barang bawaan sering jadi beban. |
| 02.mp3 | 5,7 | 8,5 | Ransel berat, tangan penuh belanjaan, dan bingung harus titip barang di mana. Pengunjung mall dan stadion pun butuh tempat penitipan yang jelas. |
| 03.mp3 | 14,7 | 5,0 | Kenalan dengan Lock and Go, loker penitipan barang di titik ramai. |
| 04.mp3 | 20,2 | 7,5 | Tersedia di mall, stasiun, dan stadion, dengan jam operasional yang jelas. |
| 05.mp3 | 28,2 | 7,5 | Pilih ukuran M untuk kebutuhan harian, atau ukuran L untuk barang yang lebih besar. Cukup ukur tinggi barangmu. |
| 06a.mp3 | 36,1 | 3,4 | Pilih lokasi dan cek stok yang tersedia, |
| 06b.mp3 | 39,7 | 2,6 | pilih ukuran yang pas, |
| 06c.mp3 | 42,6 | 3,3 | tentukan durasi, |
| 06d.mp3 | 46,1 | 3,8 | dan lokermu siap dipakai. |
| 07.mp3 | 50,2 | 5,5 | Lebih praktis, lebih tenang, dan lebih bebas bergerak. |
| 08.mp3 | 56,2 | 4,5 | Lock and Go. Titip dulu, jalan lagi. |

## Cara pasang
1. Buat 11 file di atas dengan layanan TTS atau pengisi suara pilihanmu, simpan di `public/vo/`.
2. Di `src/Root.tsx` ubah `const HAS_VO = false` menjadi `true`.
3. Render ulang: `npm run render`. Tiap klip otomatis tepat waktu mengikuti adegan.

Alternatif tanpa Remotion: satukan satu file suara penuh dengan
`ffmpeg -i lockngo-intro.mp4 -i voiceover.mp3 -c:v copy -c:a aac -shortest lockngo-vo.mp4`
