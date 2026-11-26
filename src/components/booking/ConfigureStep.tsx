'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  X,
  MapPin,
  Clock,
  Check,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { CFG } from '@/lib/data';
import { rupiah, priceOf, isOpenNow } from '@/lib/engine';
import { LockerSize, LocationConfig } from '@/types/locker';
import type { LocationAvailabilityMap } from '@/services/bookingService';

type CategoryFilter = 'all' | 'mall' | 'stasiun' | 'stadion';

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'mall', label: 'Mall' },
  { id: 'stasiun', label: 'Stasiun' },
  { id: 'stadion', label: 'Stadion' },
];

interface ConfigureStepProps {
  selectedLocationId: string;
  setSelectedLocationId: (id: string) => void;
  selectedSize: LockerSize;
  setSelectedSize: (sz: LockerSize) => void;
  selectedHours: number;
  setSelectedHours: (hrs: number) => void;
  loc: LocationConfig;
  currentTime: number;
  canFit: boolean;
  blockReason: string | null;
  availability?: LocationAvailabilityMap | null;
  isSubmitting?: boolean;
  actionError?: string;
  isLoggedIn?: boolean;
  onOpenLoginCheck?: () => void;
  onProceedToPay: () => void;
}

export default function ConfigureStep({
  selectedLocationId,
  setSelectedLocationId,
  selectedSize,
  setSelectedSize,
  selectedHours,
  setSelectedHours,
  loc,
  currentTime,
  canFit,
  blockReason,
  availability,
  isSubmitting = false,
  actionError = '',
  isLoggedIn = false,
  onOpenLoginCheck,
  onProceedToPay,
}: ConfigureStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [only24h, setOnly24h] = useState(false);

  const filteredLocations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CFG.locations.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }
      if (only24h && !item.alwaysOpen) {
        return false;
      }
      if (q) {
        const hay = `${item.name} ${item.area} ${item.categoryLabel}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [searchQuery, categoryFilter, only24h]);

  const currentPrice = priceOf(selectedSize, selectedHours);
  const selectedLocAvail = availability?.[selectedLocationId];
  const selectedSizeAvail = selectedLocAvail?.[selectedSize];
  const isSelectedSizeFull =
    selectedSizeAvail !== undefined && selectedSizeAvail.ready <= 0;

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setOnly24h(false);
  };

  return (
    <div className="space-y-4">
      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Location Directory */}
        <section className="md:col-span-7 bg-white rounded-3xl border border-ink-line shadow-card overflow-hidden">
          <div className="p-5 sm:p-6 pb-4 space-y-4 border-b border-ink-line">
            <div className="flex items-baseline justify-between gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-bloodwine tracking-tight">
                Pilih Titik Loker
              </h1>
              <span className="text-xs font-mono text-ink-soft">
                {filteredLocations.length}/{CFG.locations.length} titik
              </span>
            </div>

            {/* Clean Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="location-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari mall, stasiun, atau stadion..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-ink-line bg-cream/40 focus:bg-white focus:border-bloodwine focus:ring-2 focus:ring-bloodwine/10 text-sm text-ink placeholder:text-ink-soft transition-all focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-ink-soft hover:text-bloodwine"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Minimal Category Filter Row */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORY_TABS.map((tab) => {
                const active = categoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      active
                        ? 'bg-bloodwine text-white'
                        : 'text-ink-muted hover:text-bloodwine hover:bg-cream'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setOnly24h((v) => !v)}
                className={`ml-auto px-2.5 py-1 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 border ${
                  only24h
                    ? 'bg-sunflare text-bloodwine border-sunflare'
                    : 'bg-white text-ink-muted hover:text-bloodwine border-ink-line'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>24 Jam</span>
              </button>
            </div>
          </div>

          {/* Flat Hairline-Divided Location List (No Card-in-Card) */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-ink-line/70">
            {filteredLocations.length === 0 ? (
              <div className="py-12 px-6 text-center space-y-2">
                <p className="text-sm font-semibold text-ink-muted">
                  Titik loker tidak ditemukan.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-bold text-bloodwine hover:underline"
                >
                  Reset filter
                </button>
              </div>
            ) : (
              filteredLocations.map((item) => {
                const isSelected = item.id === selectedLocationId;
                const openNow = isOpenNow(item, currentTime);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedLocationId(item.id)}
                    className={`w-full text-left px-5 sm:px-6 py-3.5 transition-colors flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-bloodwine-tint/35'
                        : 'bg-white hover:bg-cream/50'
                    }`}
                  >
                    {/* Radio Indicator */}
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-bloodwine text-white'
                          : 'border border-ink-line bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>

                    {/* Two Clean Lines Only */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-bold truncate ${
                            isSelected ? 'text-bloodwine' : 'text-ink'
                          }`}
                        >
                          {item.name}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold flex-shrink-0 ${
                            openNow ? 'text-emerald-700' : 'text-ink-soft'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              openNow ? 'bg-emerald-500' : 'bg-ink-soft'
                            }`}
                          />
                          {item.alwaysOpen ? '24 Jam' : openNow ? 'Buka' : 'Tutup'}
                        </span>
                      </div>

                      <div className="mt-0.5 flex items-center justify-between gap-2 text-xs text-ink-muted">
                        <span className="truncate">{item.area}</span>
                        <span className="font-mono text-[11px] text-ink-soft flex-shrink-0">
                          {item.alwaysOpen ? '00.00–24.00' : item.open}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Size, Duration & Checkout */}
        <section className="md:col-span-5 bg-white rounded-3xl border border-ink-line shadow-card overflow-hidden">
          <div className="p-5 sm:p-6 space-y-5">
            {/* Selected Location Context */}
            <div className="pb-4 border-b border-ink-line">
              <div className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                Lokasi Terpilih
              </div>
              <div className="mt-1 font-extrabold text-base text-bloodwine leading-snug">
                {loc.name}
              </div>
              <div className="mt-0.5 text-xs text-ink-muted flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-bloodwine/70 flex-shrink-0" />
                <span className="truncate">{loc.area}</span>
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Ukuran Loker
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(['M', 'L'] as LockerSize[]).map((sz) => {
                  const c = CFG.sizes[sz];
                  const isSelected = selectedSize === sz;
                  const szAvail = selectedLocAvail?.[sz];
                  const isFull = szAvail !== undefined && szAvail.ready <= 0;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-bloodwine bg-bloodwine-tint/25 ring-1 ring-bloodwine'
                          : 'border-ink-line bg-white hover:border-bloodwine/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-bloodwine">
                          {c.name}
                        </span>
                        <span className="text-[10px] font-mono text-ink-muted">
                          {c.litre}L
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-ink mt-1">
                        {c.dims}
                      </div>
                      <div className="text-[11px] text-ink-muted mt-0.5 truncate">
                        {c.short}
                      </div>
                      {szAvail && (
                        <div
                          className={`mt-1.5 text-[10px] font-mono font-bold ${
                            isFull ? 'text-red-600' : 'text-emerald-700'
                          }`}
                        >
                          {isFull
                            ? 'Penuh'
                            : `${szAvail.ready}/${szAvail.total} tersedia`}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  Durasi Sewa
                </label>
                <span className="text-[11px] font-mono text-ink-soft">
                  {loc.alwaysOpen ? '24 Jam' : loc.open}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {CFG.durations.map((hrs) => {
                  const isSelected = selectedHours === hrs;
                  const price = priceOf(selectedSize, hrs);
                  return (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setSelectedHours(hrs)}
                      className={`py-2 px-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-bloodwine border-bloodwine text-white shadow-sm'
                          : 'bg-white border-ink-line text-ink hover:border-bloodwine/50'
                      }`}
                    >
                      <span className="text-xs font-extrabold">{hrs} Jam</span>
                      <span
                        className={`text-[10px] font-mono mt-0.5 ${
                          isSelected ? 'text-sunflare font-bold' : 'text-ink-muted'
                        }`}
                      >
                        {rupiah(price)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {!canFit && !loc.alwaysOpen && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p>
                      Durasi ini melewati jam operasional ({loc.open}). Pengambilan barang dilakukan saat lokasi buka kembali, atau pilih titik 24 jam.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedLocationId('gub')}
                      className="font-bold text-bloodwine hover:underline"
                    >
                      Pindah ke Stasiun Gubeng (24 Jam)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Clean Checkout Footer */}
          <div className="px-5 sm:px-6 py-4 bg-cream/60 border-t border-ink-line space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-ink-muted">
                Total ({CFG.sizes[selectedSize].name} · {selectedHours} Jam)
              </span>
              <span className="text-2xl font-extrabold text-bloodwine font-mono">
                {rupiah(currentPrice)}
              </span>
            </div>

            {actionError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {actionError}
              </div>
            )}

            <button
              type="button"
              disabled={isSubmitting || isSelectedSizeFull}
              onClick={onProceedToPay}
              className="w-full py-3.5 rounded-2xl bg-sunflare hover:bg-sunflare-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-bloodwine font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>
                {isSubmitting
                  ? 'Mengunci unit loker...'
                  : isSelectedSizeFull
                  ? 'Unit Penuh di Lokasi Ini'
                  : isLoggedIn
                  ? 'Lanjut ke Pembayaran'
                  : 'Verifikasi HP & Bayar'}
              </span>
              {!isSubmitting && !isSelectedSizeFull && (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>

            {!isLoggedIn && onOpenLoginCheck && (
              <button
                type="button"
                onClick={onOpenLoginCheck}
                className="w-full py-1 text-center text-xs font-semibold text-ink-muted hover:text-bloodwine transition-colors"
              >
                Sudah punya loker aktif? Masuk dengan nomor HP
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Subtle Single-Line Safety Reminder */}
      <div className="flex items-center justify-center gap-2 text-xs text-ink-muted px-2">
        <ShieldCheck className="w-3.5 h-3.5 text-bloodwine flex-shrink-0" />
        <span>
          Jangan simpan uang tunai, barang berharga, makanan mudah basi, atau bahan mudah terbakar.
        </span>
      </div>
    </div>
  );
}
