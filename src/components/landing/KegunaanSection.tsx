'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function KegunaanSection() {
  const handleNavigateToCaraKerja = (tab: 'titip' | 'ambil') => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('switch-cara-pakai', { detail: tab }));
      window.history.replaceState(null, '', tab === 'ambil' ? '#cara-ambil' : '#cara-titip');
      const el = document.getElementById('cara-kerja');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="kegunaan" className="py-20 md:py-28 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header (Clean, confident, zero AI badge clutter) */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bloodwine tracking-tight leading-[1.15]">
            Bebaskan langkahmu,<br className="hidden sm:inline" />{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bloodwine via-[#C0391B] via-[#E26D16] to-[#F7B638]">
              titip barang praktis.
            </span>
          </h2>

          <p className="text-ink-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Loker pintar otomatis untuk simpan dan ambil barang bawaanmu dengan aman, cepat, dan mandiri.
          </p>
        </div>

        {/* 2 Focused Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Titip Barang */}
          <article className="group bg-white rounded-3xl p-6 sm:p-8 border border-ink-line hover:border-sunflare shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-cream-subtle">
                <Image
                  src="/assets/kegunaan-titip.webp"
                  alt="Pelanggan menitipkan tas ke dalam loker LocknGo"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold text-bloodwine mb-3">
                Titip tas & barang bawaan
              </h3>
              <p className="text-ink-muted leading-relaxed text-sm sm:text-base">
                Simpan tas, belanjaan, helm, atau koper dengan aman. Bebas beraktivitas tanpa terbebani barang bawaan.
              </p>
            </div>
            <div className="pt-6 border-t border-ink-line/60 mt-6">
              <button
                type="button"
                onClick={() => handleNavigateToCaraKerja('titip')}
                className="inline-flex items-center gap-2 text-sm font-bold text-bloodwine hover:text-bloodwine-hover group/link"
              >
                <span>Lihat cara titip barang</span>
                <ArrowRight className="w-4 h-4 text-sunflare transition-transform duration-200 group-hover/link:translate-x-1" />
              </button>
            </div>
          </article>

          {/* Card 2: Ambil Barang */}
          <article className="group bg-white rounded-3xl p-6 sm:p-8 border border-ink-line hover:border-sunflare shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-cream-subtle">
                <Image
                  src="/assets/kegunaan-ambil.webp"
                  alt="Pelanggan mengambil paket dari loker LocknGo"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold text-bloodwine mb-3">
                Ambil barang kapan saja
              </h3>
              <p className="text-ink-muted leading-relaxed text-sm sm:text-base">
                Titip atau ambil barang secara mandiri menggunakan kode QR kapan pun kamu siap tanpa terikat waktu.
              </p>
            </div>
            <div className="pt-6 border-t border-ink-line/60 mt-6">
              <button
                type="button"
                onClick={() => handleNavigateToCaraKerja('ambil')}
                className="inline-flex items-center gap-2 text-sm font-bold text-bloodwine hover:text-bloodwine-hover group/link"
              >
                <span>Lihat cara ambil paket</span>
                <ArrowRight className="w-4 h-4 text-sunflare transition-transform duration-200 group-hover/link:translate-x-1" />
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
