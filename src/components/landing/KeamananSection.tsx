import Image from 'next/image';

const LOCKNGO_PILLARS = [
  {
    num: '01',
    image: '/assets/fitur-browser.webp',
    alt: 'Ilustrasi akses LocknGo lewat browser HP tanpa instal aplikasi',
    title: 'Tanpa Instal Aplikasi',
    desc: 'Pesan, bayar QRIS, dan buka loker langsung dari browser HP tanpa perlu unduh aplikasi.',
  },
  {
    num: '02',
    image: '/assets/fitur-qr.webp',
    alt: 'Ilustrasi pemindaian QR sekali pakai LocknGo',
    title: 'QR Sekali Pakai & Kode Cadangan',
    desc: 'Setiap transaksi memakai QR unik sekali pakai, ditambah kode akses cadangan bila layar sulit dipindai.',
  },
  {
    num: '03',
    image: '/assets/fitur-notif.webp',
    alt: 'Ilustrasi notifikasi pengingat WhatsApp otomatis LocknGo',
    title: 'Pengingat WhatsApp Otomatis',
    desc: 'Notifikasi dikirim 30 menit dan 10 menit sebelum sewa berakhir agar kamu tidak terlambat.',
  },
  {
    num: '04',
    image: '/assets/fitur-loker.webp',
    alt: 'Ilustrasi loker baja berkunci elektronik dan sensor pintar',
    title: 'Loker Baja & Sensor Pintar',
    desc: 'Pelat baja berkunci elektronik dengan sensor pintu dan sensor isi yang tercatat di log sistem.',
  },
  {
    num: '05',
    image: '/assets/fitur-cctv.webp',
    alt: 'Ilustrasi kamera pengawas CCTV 24 jam LocknGo',
    title: 'CCTV 24 Jam & Petugas Jaga',
    desc: 'Area unit diawasi kamera CCTV nonstop, pantauan jarak jauh, serta dukungan petugas di lokasi.',
  },
  {
    num: '06',
    image: '/assets/fitur-pesan.webp',
    alt: 'Ilustrasi pesan loker lebih awal sebelum tiba di lokasi',
    title: 'Pesan Sebelum Tiba di Lokasi',
    desc: 'Masih di kereta atau perjalanan? Pesan loker dari HP lebih awal, lalu pindai QR setibanya di sana.',
  },
];

export default function KeamananSection() {
  return (
    <section id="keamanan" className="py-20 md:py-28 bg-white border-t border-ink-line scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Clean Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bloodwine tracking-tight leading-[1.15]">
            Tenang, barangmu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bloodwine via-[#C0391B] via-[#E26D16] to-[#F7B638]">
              dijaga ketat.
            </span>
          </h2>
          <p className="text-ink-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Kombinasi keamanan fisik, akses digital mandiri, dan pengingat otomatis untuk setiap sesi sewa.
          </p>
        </div>

        {/* 3x2 LocknGo Signature Cards with Custom 3D Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOCKNGO_PILLARS.map((item) => (
            <article
              key={item.num}
              className="group bg-cream/60 hover:bg-white rounded-3xl p-6 sm:p-7 border border-ink-line hover:border-bloodwine/40 shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-5">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-ink-line/70 bg-sunflare-light shadow-xs flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="font-mono text-xs font-bold tracking-widest text-ink-soft group-hover:text-bloodwine transition-colors pt-1">
                    {item.num}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-bloodwine leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
