'use client';

import { useState } from 'react';
import { Bell, SlidersHorizontal, X } from 'lucide-react';
import { Time, fmtClock, pad } from '@/lib/engine';

interface TimeSimulatorFooterProps {
  currentTime: number;
  timeOffset: number;
  rentalEndAt?: number;
  hasActiveRental?: boolean;
  onSimulateNotif?: () => void;
  onJumpToRemainingMinutes?: (minutesLeft: number) => void;
  onTimeChanged?: () => void;
}

function formatOffsetLabel(offsetMs: number): string {
  const totalMin = Math.round(offsetMs / 60000);
  if (totalMin === 0) return '';
  const sign = totalMin > 0 ? '+' : '-';
  const absMin = Math.abs(totalMin);
  const h = Math.floor(absMin / 60);
  const m = absMin % 60;
  if (h > 0 && m > 0) return `${sign}${h}j ${m}m`;
  if (h > 0) return `${sign}${h} Jam`;
  return `${sign}${m} mnt`;
}

export default function TimeSimulatorFooter({
  currentTime,
  timeOffset,
  rentalEndAt = 0,
  hasActiveRental = false,
  onSimulateNotif,
  onJumpToRemainingMinutes,
  onTimeChanged,
}: TimeSimulatorFooterProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('30');
  const [customClock, setCustomClock] = useState(() => {
    const d = new Date(currentTime);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  const advance = (ms: number) => {
    Time.advance(ms);
    onTimeChanged?.();
  };

  const resetClock = () => {
    Time.reset();
    onTimeChanged?.();
  };

  const handleApplyMinutes = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = Number(customMinutes);
    if (!Number.isFinite(mins) || mins === 0) return;
    advance(mins * 60000);
    setEditOpen(false);
  };

  const handleApplyClock = (e: React.FormEvent) => {
    e.preventDefault();
    const [hh, mm] = customClock.split(':').map(Number);
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return;
    Time.setClock(hh, mm);
    onTimeChanged?.();
    setEditOpen(false);
  };

  const offsetText = formatOffsetLabel(timeOffset);

  return (
    <footer className="relative bg-bloodwine-deep/95 backdrop-blur-md text-white py-3 px-4 border-t border-white/10">
      {/* Custom Time Editor Drawer */}
      {editOpen && (
        <div className="max-w-5xl mx-auto mb-3 p-3.5 rounded-2xl bg-black/35 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleApplyMinutes} className="flex items-center gap-1.5">
              <label htmlFor="sim-custom-min" className="text-white/75 text-[11px] font-semibold">
                Maju menit:
              </label>
              <input
                id="sim-custom-min"
                type="number"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="w-20 px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-sunflare"
                placeholder="30"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-lg bg-sunflare hover:bg-sunflare-hover text-bloodwine font-bold text-[11px] transition-colors"
              >
                Terapkan
              </button>
            </form>

            <span className="text-white/30 hidden sm:inline">|</span>

            <form onSubmit={handleApplyClock} className="flex items-center gap-1.5">
              <label htmlFor="sim-custom-clock" className="text-white/75 text-[11px] font-semibold">
                Atur jam:
              </label>
              <input
                id="sim-custom-clock"
                type="time"
                value={customClock}
                onChange={(e) => setCustomClock(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-sunflare"
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-[11px] transition-colors"
              >
                Set Jam
              </button>
            </form>
          </div>

          <button
            type="button"
            onClick={() => setEditOpen(false)}
            aria-label="Tutup edit waktu"
            className="self-end sm:self-auto p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-sunflare animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/60">
            Jam Demo
          </span>
          <span className="font-mono text-white font-bold">
            {fmtClock(currentTime)} WIB
          </span>
          {offsetText && (
            <span className="text-[10px] bg-sunflare/20 text-sunflare border border-sunflare/30 px-2 py-0.5 rounded-full font-mono font-bold">
              {offsetText}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {hasActiveRental && rentalEndAt > 0 && onJumpToRemainingMinutes ? (
            <>
              <button
                type="button"
                onClick={() => onJumpToRemainingMinutes(30)}
                className="px-2.5 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/30 text-sunflare font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                title="Lompat ke 30 menit sebelum sewa habis untuk memicu notifikasi 30 menit"
              >
                <Bell className="w-3 h-3" />
                <span>Sisa 30m</span>
              </button>
              <button
                type="button"
                onClick={() => onJumpToRemainingMinutes(10)}
                className="px-2.5 py-1.5 rounded-lg bg-red-500/25 hover:bg-red-500/35 border border-red-300/30 text-white font-bold text-[11px] transition-colors inline-flex items-center gap-1 mr-1"
                title="Lompat ke 10 menit sebelum sewa habis untuk memicu notifikasi 10 menit"
              >
                <Bell className="w-3 h-3 text-sunflare" />
                <span>Sisa 10m</span>
              </button>
            </>
          ) : onSimulateNotif ? (
            <button
              type="button"
              onClick={onSimulateNotif}
              className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-sunflare font-bold text-[11px] transition-colors inline-flex items-center gap-1 mr-1"
              title="Uji tampilan notifikasi pengingat WhatsApp"
            >
              <Bell className="w-3 h-3" />
              <span>Test Notif WA</span>
            </button>
          ) : null}

          <span className="text-[11px] text-white/55 hidden sm:inline mr-1">
            Simulasi waktu:
          </span>
          <button
            type="button"
            onClick={() => advance(5 * 60000)}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-colors"
            title="Maju 5 Menit"
          >
            +5m
          </button>
          <button
            type="button"
            onClick={() => advance(3600000)}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-colors"
            title="Maju 1 Jam"
          >
            +1 Jam
          </button>
          <button
            type="button"
            onClick={() => advance(3 * 3600000)}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-colors"
            title="Maju 3 Jam"
          >
            +3 Jam
          </button>
          <button
            type="button"
            onClick={() => advance(24 * 3600000)}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-colors"
            title="Maju 24 Jam"
          >
            +24 Jam
          </button>
          <button
            type="button"
            onClick={() => {
              const d = new Date(currentTime);
              setCustomClock(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
              setEditOpen((o) => !o);
            }}
            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-colors inline-flex items-center gap-1 border ${
              editOpen
                ? 'bg-white text-bloodwine border-white'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
            }`}
            title="Edit simulasi waktu secara kustom (menit atau jam)"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={resetClock}
            className="px-3 py-1.5 rounded-lg bg-sunflare hover:bg-sunflare-hover text-bloodwine font-bold text-[11px] transition-colors"
            title="Kembali ke jam nyata"
          >
            Reset Jam
          </button>
        </div>
      </div>
    </footer>
  );
}
