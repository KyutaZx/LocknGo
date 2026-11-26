import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex items-center overflow-hidden">
      {/* Full-bleed Photo Background (Like Paxelbox Hero) */}
      <div
        className="absolute inset-0 bg-cover bg-center sm:bg-[center_right] z-0"
        style={{ backgroundImage: `url('/assets/hero-locker.webp')` }}
      />

      {/* Subtle Directional Vignette Gradient (Dark on left for crisp readability, transparent on right to show locker & pedestrians) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-[1]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-28">
        <div className="max-w-xl space-y-6">
          {/* Translucent Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold tracking-wide uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-sunflare animate-pulse" />
            Smart Locker untuk Aktivitasmu
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
            Titip barang,<br />
            <span className="text-sunflare">jalan terus.</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-white/90 font-normal leading-relaxed max-w-lg">
            Pesan dari HP, bayar QRIS, buka pakai QR. Tanpa antre, tanpa instal aplikasi, barang bawaan tersimpan aman dengan pantauan sensor pintar.
          </p>

          {/* Action Buttons (Paxelbox-style Pill Buttons) */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/pesan"
              className="inline-flex items-center justify-center gap-2 font-bold text-bloodwine bg-sunflare hover:bg-sunflare-hover active:scale-95 px-8 py-4 rounded-full shadow-lg shadow-black/20 text-base transition-all"
            >
              Pesan loker sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#cara-kerja"
              className="inline-flex items-center justify-center font-bold text-white hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/80 px-7 py-4 rounded-full text-base transition-colors"
            >
              Lihat cara kerjanya
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
