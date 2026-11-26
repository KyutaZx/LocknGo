import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowRight, Headphones } from 'lucide-react';

const WA_SUPPORT_URL =
  'https://wa.me/6281234567890?text=Halo%20LocknGo%20saya%20butuh%20bantuan';

const NAV_ITEMS = [
  { label: 'Kegunaan', href: '/#kegunaan' },
  { label: 'Cara Pakai', href: '/#cara-kerja' },
  { label: 'Ukuran Loker', href: '/#ukuran' },
  { label: 'Lokasi Loker', href: '/#lokasi' },
  { label: 'Keamanan', href: '/#keamanan' },
  { label: 'Tanya Jawab', href: '/#faq' },
];

export default function Footer() {
  return (
    <footer className="bg-bloodwine-deep text-white/90 border-t border-bloodwine">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10">
        {/* Top Action Strip */}
        <div className="pb-12 mb-12 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Siap titip barang tanpa antre?
            </h3>
            <p className="text-sm text-white/75 leading-relaxed">
              Pesan loker langsung dari browser HP, bayar QRIS, dan buka otomatis pakai QR.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/pesan"
              className="inline-flex items-center gap-2 font-bold text-bloodwine bg-sunflare hover:bg-sunflare-hover active:scale-[0.98] px-6 py-3.5 rounded-2xl text-sm transition-all shadow-sm whitespace-nowrap"
            >
              <span>Pesan Loker Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={WA_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 px-5 py-3.5 rounded-2xl text-sm transition-colors whitespace-nowrap"
            >
              <Headphones className="w-4 h-4 text-sunflare" />
              <span>WhatsApp CS</span>
            </a>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              aria-label="LocknGo Beranda"
              className="inline-flex items-center bg-white px-3.5 py-2 rounded-xl shadow-sm hover:opacity-95 transition-opacity"
            >
              <Image
                src="/assets/logo.png"
                alt="LocknGo"
                width={120}
                height={36}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-white/75 text-sm max-w-sm leading-relaxed">
              Solusi loker digital mandiri. Titip tas, belanjaan, dan koper dengan aman, cepat, dan praktis langsung dari browser ponselmu.
            </p>
            <p className="text-xs font-mono text-white/50">
              Operasional CS: Setiap hari, 07.00 – 23.00 WIB
            </p>
          </div>

          {/* Navigation Links (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-sunflare">
              Navigasi
            </h4>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-sm text-white/80">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-sunflare transition-colors inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Services & Legal (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-sunflare">
              Layanan &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link href="/pesan" className="hover:text-sunflare transition-colors">
                  Pesan / Cek Pesanan
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-sunflare transition-colors">
                  Syarat &amp; Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-sunflare transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <a
                  href={WA_SUPPORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sunflare transition-colors inline-flex items-center gap-1"
                >
                  <span>Hubungi Bantuan</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-sunflare" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/55">
          <p>© {new Date().getFullYear()} LocknGo Indonesia. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              Syarat &amp; Ketentuan
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
