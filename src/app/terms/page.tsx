import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Syarat & Ketentuan — LocknGo',
  description: 'Ketentuan penggunaan layanan loker pintar otomatis LocknGo.',
};

const TERMS_SECTIONS = [
  {
    num: '01',
    title: 'Perhitungan Waktu Sewa',
    body: 'Waktu sewa baru mulai dihitung pada saat barang telah dimasukkan dan pintu loker tertutup rapat. Menyelesaikan sewa lebih awal dari durasi paket tidak mengembalikan sisa biaya sewa.',
  },
  {
    num: '02',
    title: 'Keterlambatan & Denda',
    body: 'Tidak terdapat masa toleransi keterlambatan. Keterlambatan dihitung sejak kode QR dipindai di unit loker sebesar Rp5.000 per blok 5 menit, dengan batas denda maksimal 24 jam (Rp120.000). Tarif denda dikunci selama 5 menit sejak tagihan muncul.',
  },
  {
    num: '03',
    title: 'Perpanjangan Durasi',
    body: 'Pengguna menerima pengingat otomatis 30 menit dan 10 menit sebelum durasi berakhir melalui browser dan WhatsApp. Tambah durasi (+1 jam atau +3 jam) dapat dilakukan sebelum waktu sewa habis.',
  },
  {
    num: '04',
    title: 'Barang Tertinggal & Batas 24 Jam',
    body: 'Apabila ada barang tertinggal setelah sewa selesai, tersedia waktu koreksi 10 menit gratis melalui petugas di lokasi. Barang yang tidak diambil lebih dari 24 jam setelah masa sewa berakhir akan diamankan oleh petugas dan disimpan selama maksimal 7 hari.',
  },
  {
    num: '05',
    title: 'Daftar Barang Terlarang',
    body: 'Pengguna dilarang menyimpan bahan mudah terbakar atau meledak, senjata tajam/api, narkotika, minuman beralkohol, hewan atau tanaman hidup, makanan mudah basi/berbau menyengat, cairan tanpa segel rapat, uang tunai, maupun perhiasan bernilai tinggi.',
  },
  {
    num: '06',
    title: 'Gangguan Sistem LocknGo',
    body: 'Apabila keterlambatan atau kendala pembukaan loker disebabkan oleh gangguan sistem LocknGo (unit offline, pemindai bermasalah, atau keterlambatan verifikasi sistem), biaya kelebihan waktu tidak akan ditagihkan dan kejadian dicatat dalam log sistem.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ink-line">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/logo.png"
              alt="LocknGo"
              width={130}
              height={40}
              className="h-9 w-auto object-contain"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-bloodwine hover:text-bloodwine-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-14 sm:py-20">
        <div className="space-y-3 mb-12">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-sunflare">
            Dokumen Legal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bloodwine tracking-tight">
            Syarat &amp; Ketentuan
          </h1>
          <p className="text-ink-muted text-sm sm:text-base max-w-2xl leading-relaxed">
            Ketentuan berikut mengatur penggunaan layanan penitipan barang mandiri LocknGo agar tetap aman, transparan, dan nyaman bagi seluruh pengguna.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-ink-line shadow-soft divide-y divide-ink-line overflow-hidden">
          {TERMS_SECTIONS.map((sec) => (
            <section key={sec.num} className="p-6 sm:p-8 flex items-start gap-5">
              <span className="font-mono text-sm font-bold text-sunflare pt-1 flex-shrink-0">
                {sec.num}
              </span>
              <div className="space-y-1.5">
                <h2 className="text-lg font-extrabold text-bloodwine">{sec.title}</h2>
                <p className="text-sm text-ink-muted leading-relaxed">{sec.body}</p>
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
