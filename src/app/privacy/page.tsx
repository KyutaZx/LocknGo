import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Kebijakan Privasi — LocknGo',
  description: 'Kebijakan pengelolaan data pribadi dan keamanan informasi pengguna LocknGo.',
};

const PRIVACY_SECTIONS = [
  {
    num: '01',
    title: 'Data yang Kami Kumpulkan',
    body: 'LocknGo hanya mengumpulkan data minimal yang diperlukan untuk operasional loker, yaitu nomor HP aktif (untuk verifikasi OTP dan notifikasi WhatsApp), detail transaksi sewa, serta log aktivitas buka-tutup unit loker.',
  },
  {
    num: '02',
    title: 'Tujuan Penggunaan Data',
    body: 'Nomor HP digunakan untuk mengirimkan kode OTP, tautan akses QR, pengingat durasi sewa 30 menit dan 10 menit sebelum berakhir, serta bantuan darurat apabila terjadi kendala di lokasi.',
  },
  {
    num: '03',
    title: 'Rekaman CCTV & Log Akses',
    body: 'Area unit loker dipantau kamera CCTV 24 jam dan setiap pemindaian QR tercatat pada log sistem semata-mata untuk menjamin keamanan barang titipan dan membantu investigasi bila terjadi insiden.',
  },
  {
    num: '04',
    title: 'Perlindungan & Kerahasiaan Data',
    body: 'LocknGo tidak pernah menjual, menyewakan, atau membagikan data pribadi pengguna kepada pihak ketiga untuk kepentingan promosi tanpa persetujuan eksplisit dari pengguna.',
  },
  {
    num: '05',
    title: 'Kontak Layanan Privasi',
    body: 'Jika Anda memiliki pertanyaan atau permintaan penghapusan data riwayat transaksi, silakan hubungi tim bantuan kami melalui WhatsApp Support setiap hari pukul 07.00–23.00 WIB.',
  },
];

export default function PrivacyPage() {
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
            Privasi Pengguna
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bloodwine tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="text-ink-muted text-sm sm:text-base max-w-2xl leading-relaxed">
            Kami menghargai privasi setiap pengguna LocknGo. Berikut penjelasan singkat bagaimana data nomor HP dan aktivitas loker Anda dikelola secara aman.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-ink-line shadow-soft divide-y divide-ink-line overflow-hidden">
          {PRIVACY_SECTIONS.map((sec) => (
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
