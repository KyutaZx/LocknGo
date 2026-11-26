'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { CFG } from '@/lib/data';
import { createClient } from '@/lib/supabase/client';
import type { LocationAvailabilityMap } from '@/services/bookingService';
import { Search, MapPin, LocateFixed, SlidersHorizontal, X } from 'lucide-react';
import LocationCard from './lokasi/LocationCard';
import SurabayaMap from './lokasi/SurabayaMap';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'Semua' },
  { id: '24h', label: 'Buka 24 jam' },
  { id: 'mall', label: 'Mall' },
  { id: 'stasiun', label: 'Stasiun Kereta' },
  { id: 'stadion', label: 'Stadion' },
] as const;

const INITIAL_VISIBLE_COUNT = 3;

export default function LokasiSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('tp1');
  const [availability, setAvailability] =
    useState<LocationAvailabilityMap | null>(null);
  const filterPopoverRef = useRef<HTMLDivElement>(null);

  const fetchAvailability = useCallback(async () => {
    try {
      const res = await fetch('/api/availability', { cache: 'no-store' });
      if (!res.ok) return;
      const json = (await res.json()) as {
        success?: boolean;
        availability?: LocationAvailabilityMap;
      };
      if (json.success && json.availability) {
        setAvailability(json.availability);
      }
    } catch {
      // Non-blocking fallback
    }
  }, []);

  useEffect(() => {
    fetchAvailability();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes('mock.supabase.co')) return;

    const supabase = createClient();
    const channel = supabase
      .channel('beranda-lockers-availability')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lockers' },
        () => {
          fetchAvailability();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAvailability]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterOpen]);

  const filteredLocations = useMemo(() => {
    return CFG.locations.filter((loc) => {
      if (activeFilter === '24h' && !loc.alwaysOpen) return false;
      if (activeFilter === 'mall' && loc.category !== 'mall') return false;
      if (activeFilter === 'stasiun' && loc.category !== 'stasiun') return false;
      if (activeFilter === 'stadion' && loc.category !== 'stadion') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          loc.name.toLowerCase().includes(q) ||
          loc.area.toLowerCase().includes(q) ||
          loc.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, activeFilter]);

  const visibleLocations = useMemo(() => {
    if (showAll) return filteredLocations;
    return filteredLocations.slice(0, INITIAL_VISIBLE_COUNT);
  }, [filteredLocations, showAll]);

  const selectedLoc = useMemo(() => {
    return (
      CFG.locations.find((l) => l.id === selectedLocationId) ||
      filteredLocations[0] ||
      CFG.locations[0]
    );
  }, [selectedLocationId, filteredLocations]);

  const handleSelectFromMap = (id: string) => {
    setSelectedLocationId(id);
    const idxInFiltered = filteredLocations.findIndex((l) => l.id === id);
    if (idxInFiltered >= INITIAL_VISIBLE_COUNT) {
      setShowAll(true);
    }
  };

  const handleUseLocation = () => {
    setSearchQuery('Tunjungan');
  };

  const activeFilterLabel =
    CATEGORY_FILTERS.find((f) => f.id === activeFilter)?.label || 'Semua';

  const hasMore = filteredLocations.length > INITIAL_VISIBLE_COUNT;

  return (
    <section
      id="lokasi"
      className="py-20 md:py-28 bg-cream border-t border-ink-line scroll-mt-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Clean Editorial Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-bloodwine tracking-tight leading-[1.15]">
            Temukan Lokasi LocknGo{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bloodwine via-[#C0391B] via-[#E26D16] to-[#F7B638]">
              Terdekat.
            </span>
          </h2>
          <p className="text-ink-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Cari berdasarkan nama lokasi, alamat, atau kode loker LocknGo.
          </p>
        </div>

        {/* Floating Pill Search Bar + Filter Icon Trigger */}
        <div className="max-w-4xl mx-auto mb-8 relative z-30" ref={filterPopoverRef}>
          <div className="bg-white p-2 rounded-3xl sm:rounded-full shadow-card border border-ink-line flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-3 px-4 py-2 w-full">
              <Search className="w-4 h-4 text-bloodwine flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari area, mall, stasiun, atau gedung..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAll(false);
                }}
                className="w-full text-ink placeholder-ink-soft bg-transparent text-sm focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-ink-soft hover:text-bloodwine font-bold px-1"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto px-2 pb-1 sm:p-0">
              <button
                type="button"
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-bloodwine hover:bg-bloodwine-hover text-white font-bold text-xs sm:text-sm whitespace-nowrap transition-colors"
              >
                Cari Lokasi
              </button>
              <button
                type="button"
                onClick={handleUseLocation}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full bg-sunflare-light hover:bg-sunflare text-bloodwine border border-sunflare/60 font-bold text-xs sm:text-sm whitespace-nowrap transition-colors inline-flex items-center justify-center gap-1.5"
                title="Gunakan lokasi saya"
              >
                <LocateFixed className="w-4 h-4" />
                <span>Pakai Lokasiku</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterOpen((prev) => !prev)}
                aria-label="Filter kategori lokasi"
                aria-expanded={filterOpen}
                title={`Filter: ${activeFilterLabel}`}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-150 ${
                  filterOpen || activeFilter !== 'all'
                    ? 'bg-bloodwine text-white border-bloodwine shadow-sm'
                    : 'bg-cream hover:bg-sunflare-light text-bloodwine border-ink-line hover:border-sunflare'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {activeFilter !== 'all' && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sunflare border-2 border-white" />
                )}
              </button>
            </div>
          </div>

          {/* Filter Popover Panel */}
          {filterOpen && (
            <div className="absolute right-0 mt-2.5 w-72 sm:w-auto bg-white rounded-2xl p-4 shadow-xl border border-ink-line z-40">
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  Filter Lokasi
                </span>
                {activeFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter('all');
                      setShowAll(false);
                      setFilterOpen(false);
                    }}
                    className="text-xs font-bold text-bloodwine hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_FILTERS.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveFilter(cat.id);
                      setShowAll(false);
                      setFilterOpen(false);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      activeFilter === cat.id
                        ? 'bg-bloodwine text-white shadow-xs'
                        : 'bg-cream text-ink hover:text-bloodwine border border-ink-line hover:border-bloodwine/40'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Filter Pill (Only shown when a filter is active) */}
        {activeFilter !== 'all' && (
          <div className="flex justify-start mb-4 px-1">
            <button
              type="button"
              onClick={() => {
                setActiveFilter('all');
                setShowAll(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-bloodwine bg-white border border-ink-line px-3.5 py-1.5 rounded-full hover:border-bloodwine transition-colors shadow-xs"
            >
              <span>Filter: {activeFilterLabel}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Side-by-Side Directory & Map */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-6 space-y-4">
            {visibleLocations.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-ink-line">
                <MapPin className="w-10 h-10 text-ink-soft mx-auto mb-3" />
                <h4 className="text-base font-bold text-bloodwine">Lokasi tidak ditemukan</h4>
                <p className="text-xs text-ink-muted mt-1">
                  Coba ubah kata kunci pencarian atau pilih filter &quot;Semua&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                    setShowAll(false);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-sunflare text-bloodwine font-bold text-xs"
                >
                  Tampilkan Semua Lokasi
                </button>
              </div>
            ) : (
              <>
                {visibleLocations.map((loc) => {
                  const globalIdx = CFG.locations.findIndex((item) => item.id === loc.id);
                  return (
                    <LocationCard
                      key={loc.id}
                      loc={loc}
                      index={globalIdx >= 0 ? globalIdx : 0}
                      isSelected={selectedLoc.id === loc.id}
                      availability={availability?.[loc.id]}
                      onSelect={setSelectedLocationId}
                    />
                  );
                })}

                {hasMore && (
                  <button
                    type="button"
                    onClick={() => setShowAll((prev) => !prev)}
                    className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-cream-subtle text-bloodwine font-bold text-sm border border-ink-line hover:border-bloodwine/40 shadow-soft transition-all duration-150 active:scale-[0.99]"
                  >
                    {showAll
                      ? 'Tampilkan Lebih Sedikit'
                      : `Lihat Lebih Banyak (${filteredLocations.length - INITIAL_VISIBLE_COUNT} lokasi lainnya)`}
                  </button>
                )}
              </>
            )}
          </div>

          <div className="md:col-span-6 md:sticky md:top-24">
            <SurabayaMap
              selectedLoc={selectedLoc}
              visibleLocationIds={filteredLocations.map((l) => l.id)}
              onSelectLocation={handleSelectFromMap}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
