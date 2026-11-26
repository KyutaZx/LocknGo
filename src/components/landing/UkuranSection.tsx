import Image from 'next/image';
import { CFG } from '@/lib/data';
import { Check } from 'lucide-react';

const MEDIUM_ITEMS = [
  '1 ransel ukuran hingga 50 cm',
  '2 sampai 3 paper bag belanja sedang',
  'Helm, tas kerja, atau barang harian',
];

const LARGE_ITEMS = [
  '1 koper kabin hingga 32 inci berdiri',
  'Stroller bayi lipat dengan ruang lega',
  '4 sampai 6 shopping bag ukuran besar',
];

export default function UkuranSection() {
  return (
    <section id="ukuran" className="py-20 md:py-28 bg-cream scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Clean Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bloodwine tracking-tight leading-[1.15]">
            Pilih loker sesuai{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bloodwine via-[#C0391B] via-[#E26D16] to-[#F7B638]">
              muatanmu.
            </span>
          </h2>
          <p className="text-ink-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Dua pilihan ukuran loker yang disesuaikan untuk barang harian maupun bawaan berukuran besar.
          </p>
        </div>

        {/* Visual Locker Size Comparison Photo */}
        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-ink-line bg-white shadow-soft mb-8">
          <Image
            src="/assets/loker.webp"
            alt="Visual perbandingan dimensi loker Medium 45 cm dan Large 90 cm"
            fill
            className="object-cover"
          />
        </div>

        {/* Side-by-Side Size Explanation Cards (M vs L) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card M: Medium */}
          <article className="bg-white rounded-3xl p-7 sm:p-8 border border-ink-line shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-ink-line">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink-muted">
                    UKURAN M · {CFG.sizes.M.litre} LITER
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-bloodwine mt-1">
                    Medium
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-bloodwine bg-cream px-3 py-1.5 rounded-lg border border-ink-line whitespace-nowrap">
                  {CFG.sizes.M.dims}
                </span>
              </div>

              <p className="text-sm text-ink-muted leading-relaxed py-5">
                Pas untuk barang bawaan harian dan belanjaan ringan tanpa memakan banyak ruang.
              </p>

              <ul className="space-y-3">
                {MEDIUM_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink">
                    <span className="w-5 h-5 rounded-full bg-bloodwine-tint text-bloodwine flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* Card L: Large */}
          <article className="bg-bloodwine text-white rounded-3xl p-7 sm:p-8 border border-bloodwine shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/15">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-sunflare">
                    UKURAN L · {CFG.sizes.L.litre} LITER
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Large
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-sunflare bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 whitespace-nowrap">
                  {CFG.sizes.L.dims}
                </span>
              </div>

              <p className="text-sm text-white/80 leading-relaxed py-5">
                Dirancang khusus untuk koper perjalanan, belanjaan banyak, atau perlengkapan keluarga.
              </p>

              <ul className="space-y-3">
                {LARGE_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/95">
                    <span className="w-5 h-5 rounded-full bg-sunflare text-bloodwine flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
