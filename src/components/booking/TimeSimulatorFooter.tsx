'use client';

import { Bell } from 'lucide-react';
import { Time, fmtClock } from '@/lib/engine';

interface TimeSimulatorFooterProps {
  currentTime: number;
  timeOffset: number;
  onSimulateNotif?: () => void;
}

export default function TimeSimulatorFooter({
  currentTime,
  timeOffset,
  onSimulateNotif,
}: TimeSimulatorFooterProps) {
  return (
    <footer className="bg-bloodwine-deep/95 backdrop-blur-md text-white py-3 px-4 border-t border-white/10">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-sunflare animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-white/60">
            Jam Demo
          </span>
          <span className="font-mono text-white font-bold">
            {fmtClock(currentTime)} WIB
          </span>
          {timeOffset !== 0 && (
            <span className="text-[10px] bg-sunflare/20 text-sunflare border border-sunflare/30 px-2 py-0.5 rounded-full font-mono font-bold">
              +{Math.round(timeOffset / 3600000)} Jam
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {onSimulateNotif && (
            <button
              type="button"
              onClick={onSimulateNotif}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-sunflare font-bold text-[11px] transition-colors inline-flex items-center gap-1 mr-1"
              title="Uji tampilan notifikasi pengingat WhatsApp 15 menit"
            >
              <Bell className="w-3 h-3" />
              <span>Test Notif WA</span>
            </button>
          )}
          <span className="text-[11px] text-white/55 hidden sm:inline mr-1">
            Simulasi waktu:
          </span>
          <button
            type="button"
            onClick={() => Time.advance(3600000)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-colors"
            title="Maju 1 Jam"
          >
            +1 Jam
          </button>
          <button
            type="button"
            onClick={() => Time.advance(3 * 3600000)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-colors"
            title="Maju 3 Jam"
          >
            +3 Jam
          </button>
          <button
            type="button"
            onClick={() => Time.advance(24 * 3600000)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] transition-colors"
            title="Maju 24 Jam"
          >
            +24 Jam
          </button>
          <button
            type="button"
            onClick={() => Time.reset()}
            className="px-3 py-1 rounded-lg bg-sunflare hover:bg-sunflare-hover text-bloodwine font-bold text-[11px] transition-colors"
            title="Kembali ke jam nyata"
          >
            Reset Jam
          </button>
        </div>
      </div>
    </footer>
  );
}
