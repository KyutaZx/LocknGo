'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const TITIP_STEPS = [
  {
    num: '01',
    title: 'Pilih Ukuran, Durasi & Bayar',
    desc: 'Pilih lokasi loker, tentukan ukuran serta durasi sewa, lalu bayar instan via QRIS.',
  },
  {
    num: '02',
    title: 'Pindai QR di Loker',
    desc: 'Hadapkan kode QR dari HP ke pemindai unit loker untuk membuka pintu otomatis.',
  },
  {
    num: '03',
    title: 'Simpan Barang & Tutup Pintu',
    desc: 'Masukkan barang bawaanmu dan tutup pintu hingga rapat. Waktu sewa mulai berjalan.',
  },
];

const AMBIL_STEPS = [
  {
    num: '01',
    title: 'Buka QR Pengambilan di HP',
    desc: 'Buka pesanan aktif di HP untuk menampilkan kode QR pengambilan barang.',
  },
  {
    num: '02',
    title: 'Pindai QR di Kamera Loker',
    desc: 'Arahkan kode QR ke pemindai unit loker untuk verifikasi akses pengambilan.',
  },
  {
    num: '03',
    title: 'Ambil Barang & Tutup Pintu',
    desc: 'Pintu loker terbuka otomatis. Ambil seluruh barang bawaanmu dan tutup pintu kembali.',
  },
];

export default function CaraPakaiSection() {
  const [activeTab, setActiveTab] = useState<'titip' | 'ambil'>('titip');

  useEffect(() => {
    const syncTabFromLocation = () => {
      const hash = window.location.hash;
      if (hash === '#cara-ambil') {
        setActiveTab('ambil');
      } else if (hash === '#cara-titip' || hash === '#cara-kerja') {
        setActiveTab('titip');
      }
    };

    syncTabFromLocation();
    window.addEventListener('hashchange', syncTabFromLocation);

    const handleCustomSwitch = (e: Event) => {
      const customEvent = e as CustomEvent<'titip' | 'ambil'>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener('switch-cara-pakai', handleCustomSwitch);

    return () => {
      window.removeEventListener('hashchange', syncTabFromLocation);
      window.removeEventListener('switch-cara-pakai', handleCustomSwitch);
    };
  }, []);

  const steps = activeTab === 'titip' ? TITIP_STEPS : AMBIL_STEPS;

  return (
    <section id="cara-kerja" className="py-20 md:py-28 bg-white border-y border-ink-line scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Centered Header & Sleek Pill Switcher */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bloodwine tracking-tight leading-[1.15]">
            Mudah digunakan,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bloodwine via-[#C0391B] via-[#E26D16] to-[#F7B638]">
              dalam 3 langkah.
            </span>
          </h2>
          <p className="text-ink-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Tanpa instal aplikasi. Cukup buka browser di HP, ikuti langkah praktis berikut.
          </p>

          {/* Refined Pill Tab Switcher (Centered, Non-Wrapping, Tactile) */}
          <div className="pt-3 flex justify-center">
            <div
              role="tablist"
              aria-label="Pilih panduan penggunaan loker"
              className="inline-flex items-center p-1.5 bg-cream border border-ink-line rounded-full shadow-soft"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'titip'}
                onClick={() => {
                  setActiveTab('titip');
                  window.history.replaceState(null, '', '#cara-titip');
                }}
                className={`inline-flex items-center gap-2.5 px-6 sm:px-7 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  activeTab === 'titip'
                    ? 'bg-bloodwine text-white shadow-sm'
                    : 'text-ink-muted hover:text-bloodwine'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeTab === 'titip' ? 'bg-sunflare' : 'bg-ink-line'
                  }`}
                />
                <span>Cara Titip Barang</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'ambil'}
                onClick={() => {
                  setActiveTab('ambil');
                  window.history.replaceState(null, '', '#cara-ambil');
                }}
                className={`inline-flex items-center gap-2.5 px-6 sm:px-7 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  activeTab === 'ambil'
                    ? 'bg-bloodwine text-white shadow-sm'
                    : 'text-ink-muted hover:text-bloodwine'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeTab === 'ambil' ? 'bg-sunflare' : 'bg-ink-line'
                  }`}
                />
                <span>Cara Ambil Barang</span>
              </button>
            </div>
          </div>
        </div>

        {/* Architectural Split Grid: Equal-Height Editorial Steps + Pure Visual Frame */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Pure Typographic Structure with Hairline Dividers */}
          <div className="md:col-span-5 flex flex-col justify-between divide-y divide-ink-line border-y border-ink-line">
            {steps.map((step) => (
              <div
                key={step.num}
                className="py-6 sm:py-8 flex items-start gap-5 group transition-colors"
              >
                <span className="font-mono text-2xl sm:text-3xl font-bold text-sunflare leading-none pt-0.5 select-none">
                  {step.num}
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-bold text-bloodwine tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-ink-muted text-sm sm:text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Flush Full-Height Photographic Frame */}
          <div className="md:col-span-7">
            <div className="relative w-full h-full min-h-[300px] sm:min-h-[400px] rounded-3xl overflow-hidden border border-ink-line bg-cream-subtle">
              <Image
                src={activeTab === 'titip' ? '/assets/cara-titip.webp' : '/assets/cara-ambil.webp'}
                alt={activeTab === 'titip' ? 'Proses scan QR di layar loker' : 'Pelanggan mengambil barang dari loker'}
                fill
                priority
                className="object-cover transition-transform duration-500 ease-out hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
