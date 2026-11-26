'use client';

import Link from 'next/link';
import { LocationConfig, LockerSize } from '@/types/locker';
import type { SizeAvailability } from '@/services/bookingService';
import { pad } from '@/lib/engine';
import { MapPin, Navigation, Clock, Calendar } from 'lucide-react';

interface LocationCardProps {
  loc: LocationConfig;
  index: number;
  isSelected: boolean;
  availability?: Record<LockerSize, SizeAvailability>;
  onSelect: (id: string) => void;
}

export default function LocationCard({
  loc,
  index,
  isSelected,
  availability,
  onSelect,
}: LocationCardProps) {
  const lockerCodePrefix = `L-${String(index + 1).padStart(3, '0')}`;

  return (
    <article
      onClick={() => onSelect(loc.id)}
      className={`cursor-pointer bg-white rounded-3xl p-5 sm:p-6 border-2 transition-all duration-200 flex flex-col sm:flex-row gap-5 ${
        isSelected
          ? 'border-bloodwine shadow-card ring-4 ring-sunflare/25'
          : 'border-ink-line hover:border-sunflare hover:shadow-soft'
      }`}
    >
      {/* Left ID Badge Block */}
      <div className="flex sm:flex-col items-center justify-between sm:justify-center p-3.5 rounded-2xl bg-bloodwine text-white w-full sm:w-24 flex-shrink-0 text-center">
        <span className="w-6 h-6 rounded-full bg-sunflare text-bloodwine font-extrabold text-xs flex items-center justify-center mb-1">
          {index + 1}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-sunflare/90">
          Kode Loker
        </span>
        <span className="font-mono font-extrabold text-sm sm:text-base tracking-tight text-white">
          {lockerCodePrefix}
        </span>
      </div>

      {/* Right Details Block */}
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-extrabold text-bloodwine leading-snug">
            {loc.name}
          </h3>
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              loc.alwaysOpen
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-sunflare-light text-bloodwine border border-sunflare/40'
            }`}
          >
            {loc.alwaysOpen ? 'Buka 24 Jam' : loc.categoryLabel}
          </span>
        </div>

        <div className="flex items-start gap-2 text-xs text-ink-muted">
          <MapPin className="w-4 h-4 text-bloodwine flex-shrink-0 mt-0.5" />
          <span>{loc.area}, Surabaya</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-ink-muted font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-bloodwine" />
            7 hari seminggu
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-bloodwine" />
            {loc.open}
          </span>
        </div>

        {/* Live Locker Availability Row */}
        {availability && (
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] font-mono">
            {(['M', 'L'] as LockerSize[]).map((sz) => {
              const info = availability[sz];
              const isFull = info.ready <= 0;
              return (
                <span
                  key={sz}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold ${
                    isFull
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-cream text-ink border-ink-line'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isFull ? 'bg-red-500' : 'bg-emerald-500'
                    }`}
                  />
                  <span>
                    {sz === 'M' ? 'Medium' : 'Large'}:{' '}
                    {isFull ? 'Penuh' : `${info.ready}/${info.total}`}
                  </span>
                </span>
              );
            })}
          </div>
        )}

        {/* 24-Hour Visual Timeline Bar */}
        <div className="space-y-1 pt-1">
          <div
            className="grid gap-0.5 h-3 bg-ink-line/50 p-0.5 rounded-md overflow-hidden"
            style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
          >
            {Array.from({ length: 24 }).map((_, h) => {
              const minute = h * 60;
              const isOpen =
                loc.alwaysOpen || (minute >= loc.openAt && minute < loc.closesAt);
              return (
                <div
                  key={h}
                  className={`h-full rounded-sm transition-colors ${
                    isOpen ? 'bg-sunflare' : 'bg-ink-line'
                  }`}
                  title={`${pad(h)}:00 ${isOpen ? 'Buka' : 'Tutup'}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] font-mono text-ink-soft">
            <span>00</span>
            <span>06</span>
            <span>12</span>
            <span>18</span>
            <span>24</span>
          </div>
        </div>

        {/* Card Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(loc.name + ' Surabaya')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sunflare hover:bg-sunflare-hover text-bloodwine font-bold text-xs transition-colors shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            Petunjuk Arah
          </a>

          <Link
            href={`/pesan?location=${loc.id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white hover:bg-cream-subtle text-bloodwine font-bold text-xs border border-bloodwine transition-colors"
          >
            Pesan di Sini →
          </Link>
        </div>
      </div>
    </article>
  );
}
