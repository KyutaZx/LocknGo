'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LocationConfig } from '@/types/locker';
import { Plus, Minus, X } from 'lucide-react';

interface MapPinItem {
  id: string;
  x: number;
  y: number;
  no: number;
  label: string;
}

const MAP_PINS: MapPinItem[] = [
  { id: 'tp1', x: 48, y: 50, no: 1, label: 'TP 1' },
  { id: 'glx', x: 76, y: 56, no: 2, label: 'Galaxy Mall' },
  { id: 'pvr', x: 24, y: 64, no: 3, label: 'Pakuwon Mall' },
  { id: 'gub', x: 64, y: 40, no: 4, label: 'St. Gubeng' },
  { id: 'pst', x: 38, y: 34, no: 5, label: 'St. Pasar Turi' },
  { id: 'gbt', x: 22, y: 28, no: 6, label: 'Gelora Bung Tomo' },
  { id: 'g10', x: 56, y: 24, no: 7, label: 'G10 November' },
];

interface SurabayaMapProps {
  selectedLoc: LocationConfig;
  visibleLocationIds: string[];
  onSelectLocation: (id: string) => void;
}

export default function SurabayaMap({
  selectedLoc,
  visibleLocationIds,
  onSelectLocation,
}: SurabayaMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [openTooltipId, setOpenTooltipId] = useState<string | null>(null);

  const handlePinClick = (e: React.MouseEvent, pinId: string) => {
    e.stopPropagation();
    onSelectLocation(pinId);
    setOpenTooltipId((prev) => (prev === pinId ? null : pinId));
  };

  return (
    <div
      onClick={() => setOpenTooltipId(null)}
      className="bg-[#EFE8DD] rounded-3xl p-4 border border-ink-line shadow-card relative overflow-hidden h-[540px] flex flex-col justify-between select-none"
    >
      {/* Stylized Street Map Grid */}
      <div
        className="absolute inset-0 opacity-70 pointer-events-none transition-transform duration-300"
        style={{
          transform: `scale(${zoomLevel})`,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(120, 1, 21, 0.05) 0%, transparent 80%),
            linear-gradient(to right, #DFD4C6 1px, transparent 1px),
            linear-gradient(to bottom, #DFD4C6 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 36px 36px, 36px 36px',
        }}
      />

      {/* Decorative Street Vectors */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-45 transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
        viewBox="0 0 460 540"
        preserveAspectRatio="none"
      >
        <path d="M 20 490 Q 150 320 230 250 T 430 80" stroke="#C9BCAC" strokeWidth="8" fill="none" />
        <path d="M 40 120 Q 180 190 320 330 T 440 480" stroke="#C9BCAC" strokeWidth="6" fill="none" />
        <path d="M 125 30 L 125 510" stroke="#D3C7B7" strokeWidth="4" fill="none" />
        <path d="M 15 270 L 445 270" stroke="#D3C7B7" strokeWidth="4" fill="none" />
      </svg>

      {/* Map Header & Zoom Controls */}
      <div className="relative z-30 flex items-center justify-between pointer-events-none">
        <span className="text-[11px] font-bold uppercase tracking-wider text-bloodwine bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-ink-line shadow-sm pointer-events-auto">
          Peta Titik Surabaya
        </span>

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col bg-white/95 backdrop-blur-md rounded-xl border border-ink-line shadow-sm overflow-hidden pointer-events-auto"
        >
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(Number((z + 0.15).toFixed(2)), 1.45))}
            className="p-2 hover:bg-cream text-bloodwine border-b border-ink-line transition-colors"
            title="Perbesar peta"
            aria-label="Perbesar peta"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(Number((z - 0.15).toFixed(2)), 0.85))}
            className="p-2 hover:bg-cream text-bloodwine transition-colors"
            title="Perkecil peta"
            aria-label="Perkecil peta"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Location Pins Layer */}
      <div className="relative z-20 flex-1 w-full my-2">
        {MAP_PINS.map((pin) => {
          const isVisible = visibleLocationIds.includes(pin.id);
          const isPinSelected = selectedLoc.id === pin.id;

          // Compute scaled coordinates around center (50, 50) so pins move cleanly on zoom without distorting tooltips
          const scaledX = Math.min(90, Math.max(10, 50 + (pin.x - 50) * zoomLevel));
          const scaledY = Math.min(88, Math.max(14, 50 + (pin.y - 50) * zoomLevel));

          // Edge-aware tooltip positioning so it NEVER clips outside map boundaries
          const isNearTop = scaledY < 38;
          const isNearLeft = scaledX < 34;
          const isNearRight = scaledX > 66;

          const tooltipVerticalClass = isNearTop ? 'top-full mt-2.5' : 'bottom-full mb-2.5';
          const tooltipHorizontalClass = isNearLeft
            ? 'left-0'
            : isNearRight
            ? 'right-0'
            : 'left-1/2 -translate-x-1/2';

          return (
            <div
              key={pin.id}
              style={{ left: `${scaledX}%`, top: `${scaledY}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isPinSelected ? 'z-40' : isVisible ? 'z-20' : 'z-10 opacity-35'
              }`}
            >
              <button
                type="button"
                onClick={(e) => handlePinClick(e, pin.id)}
                aria-label={`Pilih lokasi ${pin.label}`}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shadow-md transition-transform duration-150 ${
                  isPinSelected
                    ? 'bg-bloodwine text-sunflare ring-4 ring-sunflare scale-110'
                    : 'bg-bloodwine/90 text-white hover:bg-bloodwine hover:scale-110'
                }`}
              >
                {pin.no}
              </button>

              {isPinSelected && openTooltipId === pin.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute ${tooltipVerticalClass} ${tooltipHorizontalClass} w-56 bg-bloodwine text-white p-3.5 rounded-2xl shadow-xl border border-white/10 text-left pointer-events-auto`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-bold text-sunflare leading-snug">
                      {selectedLoc.name}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenTooltipId(null);
                      }}
                      aria-label="Tutup info lokasi"
                      className="text-white/70 hover:text-white p-0.5 -mt-0.5 -mr-1 rounded-md transition-colors flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-white/80 leading-snug mt-0.5">
                    {selectedLoc.area}
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-sunflare">
                      {selectedLoc.alwaysOpen ? 'Buka 24 Jam' : selectedLoc.open}
                    </span>
                    <Link
                      href={`/pesan?location=${selectedLoc.id}`}
                      className="font-bold text-white hover:text-sunflare underline"
                    >
                      Pilih →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Map Footer Information */}
      <div className="relative z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-ink-line flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
          <span className="text-xs font-bold text-bloodwine truncate">
            {selectedLoc.name}
          </span>
        </div>
        <Link
          href={`/pesan?location=${selectedLoc.id}`}
          className="px-3.5 py-1.5 rounded-xl bg-sunflare text-bloodwine font-bold text-xs hover:bg-sunflare-hover whitespace-nowrap transition-colors"
        >
          Pesan Loker
        </Link>
      </div>
    </div>
  );
}
