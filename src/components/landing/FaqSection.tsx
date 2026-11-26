'use client';

import { useState } from 'react';
import { Plus, Headphones, ArrowUpRight } from 'lucide-react';

const WA_SUPPORT_URL =
  'https://wa.me/6281234567890?text=Halo%20LocknGo%20saya%20ingin%20bertanya';

const FAQS = [
  {
    num: '01',
    q: 'Bagaimana jika saya telat mengambil barang melewati batas durasi?',
    a: 'Kamu tetap bisa mengambil barang kapan saja. Denda dihitung Rp5.000 per blok 5 menit (maksimal denda 24 jam sebesar Rp120.000). Bayar denda langsung via QRIS di layar loker sebelum pintu terbuka.',
  },
  {
    num: '02',
    q: 'Apakah saya wajib mengunduh atau menginstal aplikasi?',
    a: 'Tidak perlu. LocknGo berjalan penuh lewat browser HP (Chrome, Safari, dll.). Cukup login pakai nomor HP dengan kode OTP, lalu semua akses QR dan status loker langsung tampil di browser.',
  },
  {
    num: '03',
    q: 'Bagaimana jika QR sulit dipindai atau baterai HP habis?',
    a: 'Setiap pesanan dilengkapi kode akses cadangan yang bisa diketik langsung di layar loker. Jika baterai HP habis, kamu cukup login di perangkat lain memakai nomor HP-mu untuk membuka kembali akses loker.',
  },
  {
    num: '04',
    q: 'Bolehkah saya memperpanjang sewa sebelum waktu habis?',
    a: 'Bisa. Kamu akan menerima pengingat otomatis di WhatsApp 30 menit dan 10 menit sebelum durasi berakhir beserta tautan untuk menambah waktu (+1 jam atau +3 jam) dengan tarif jauh lebih hemat daripada denda.',
  },
  {
    num: '05',
    q: 'Apa saja barang yang dilarang dititipkan?',
    a: 'Demi keamanan bersama, dilarang menyimpan bahan mudah terbakar/peledak, senjata tajam/api, narkotika, alkohol, hewan/tanaman, makanan berbau menyengat, cairan tanpa segel, uang tunai, serta perhiasan bernilai tinggi.',
  },
  {
    num: '06',
    q: 'Kapan waktu sewa mulai dihitung — saat bayar atau saat pintu ditutup?',
    a: 'Waktu sewa baru mulai berjalan setelah kamu memasukkan barang dan menutup pintu loker hingga rapat, bukan sejak pembayaran QRIS berhasil.',
  },
  {
    num: '07',
    q: 'Bagaimana jika ada barang tertinggal setelah saya selesai mengambil?',
    a: 'Tersedia waktu koreksi 10 menit sejak pintu tertutup. Kamu akan mendapat notifikasi dan dapat mengambil barang yang tertinggal melalui petugas secara gratis dalam batas 10 menit tersebut.',
  },
  {
    num: '08',
    q: 'Bagaimana jika terjadi gangguan sistem saat saya ingin mengambil barang?',
    a: 'Jika kendala berasal dari sistem LocknGo (loker offline, pemindai bermasalah, atau pembayaran tertunda dari sistem), biaya kelebihan waktu tidak akan ditagihkan dan gangguan dicatat pada log sistem.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28 bg-cream border-t border-ink-line scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Editorial Heading + Support Card */}
          <div className="md:col-span-5 md:sticky md:top-28 space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bloodwine tracking-tight leading-[1.12]">
                Yang perlu kamu tahu{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-bloodwine via-[#C0391B] via-[#E26D16] to-[#F7B638]">
                  tentang LocknGo.
                </span>
              </h2>
              <p className="text-ink-muted text-base leading-relaxed">
                Mulai dari hitungan waktu sewa, cara perpanjangan, akses darurat, sampai panduan keamanan barang ada di sini.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-ink-line shadow-soft space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sunflare-light text-bloodwine border border-sunflare/40 flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-bloodwine">
                    Masih ada pertanyaan?
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Tim CS kami siap membantu setiap hari pukul 07.00–23.00 WIB.
                  </p>
                </div>
              </div>
              <a
                href={WA_SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 font-bold text-xs sm:text-sm text-bloodwine bg-sunflare hover:bg-sunflare-hover active:scale-[0.98] px-5 py-3 rounded-2xl transition-all shadow-xs"
              >
                <span>Hubungi WhatsApp Support</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Unified Hairline Accordion */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-ink-line shadow-soft divide-y divide-ink-line overflow-hidden">
            {FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={faq.num} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full p-5 sm:p-7 text-left flex items-start justify-between gap-4 group hover:bg-cream/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-mono text-xs font-bold text-sunflare pt-1.5 select-none">
                        {faq.num}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-bloodwine leading-snug">
                        {faq.q}
                      </span>
                    </div>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isOpen
                          ? 'bg-bloodwine text-sunflare rotate-45'
                          : 'bg-cream text-bloodwine border border-ink-line group-hover:border-bloodwine/40'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>

                  {/* Smooth Grid-Row Accordion Transition */}
                  <div
                    className={`grid transition-all duration-200 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-7 pb-6 pl-14 sm:pl-16 text-sm text-ink-muted leading-relaxed">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
