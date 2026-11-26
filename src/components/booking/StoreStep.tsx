'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Lock,
  Unlock,
  Copy,
  Check,
  Download,
  QrCode,
} from 'lucide-react';
import { LocationConfig } from '@/types/locker';

interface StoreStepProps {
  qrStoreDataUrl: string;
  rentalId: string;
  allocatedLocker: string;
  guardCode: string;
  loc: LocationConfig;
  isDoorOpen: boolean;
  doorCountdown: number;
  onScanAndOpenDoor: () => void;
  onCloseDoorAndActivate: () => void;
}

export default function StoreStep({
  qrStoreDataUrl,
  rentalId,
  allocatedLocker,
  guardCode,
  loc,
  isDoorOpen,
  doorCountdown,
  onScanAndOpenDoor,
  onCloseDoorAndActivate,
}: StoreStepProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [downloadedQr, setDownloadedQr] = useState(false);

  const mins = Math.floor(doorCountdown / 60);
  const secs = doorCountdown % 60;
  const formattedDoorTime =
    mins > 0 ? `${mins} menit ${secs} detik` : `${secs} detik`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(guardCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  const handleDownloadQr = () => {
    if (!qrStoreDataUrl) return;
    const link = document.createElement('a');
    link.href = qrStoreDataUrl;
    link.download = `LocknGo-QR-Loker-${allocatedLocker}-${rentalId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadedQr(true);
    setTimeout(() => setDownloadedQr(false), 1800);
  };

  return (
    <div className="bg-white rounded-3xl border border-ink-line shadow-card overflow-hidden">
      <div className="p-6 sm:p-8 space-y-6 text-center">
        {/* Header */}
        <div className="space-y-1.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
              isDoorOpen
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-bloodwine-tint text-bloodwine'
            }`}
          >
            {isDoorOpen ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <QrCode className="w-6 h-6" />
            )}
          </div>

          <h1 className="text-2xl font-extrabold text-bloodwine tracking-tight">
            {isDoorOpen ? 'Pintu Loker Terbuka' : 'Scan QR untuk Buka Loker'}
          </h1>
          <p className="text-ink-muted text-xs sm:text-sm">
            {isDoorOpen ? (
              <>
                Masukkan barang ke loker{' '}
                <strong className="font-mono text-bloodwine">{allocatedLocker}</strong> di{' '}
                {loc.name}.
              </>
            ) : (
              <>
                Arahkan QR ini ke pemindai kiosk untuk membuka loker{' '}
                <strong className="font-mono text-bloodwine">{allocatedLocker}</strong> di{' '}
                {loc.name}.
              </>
            )}
          </p>
        </div>

        {/* Door Open Countdown Banner (shown after QR is scanned) */}
        {isDoorOpen && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-sm">
              <Clock className="w-4 h-4" />
              <span>Pintu terbuka selama {formattedDoorTime}</span>
            </div>
            <p className="text-xs text-emerald-900/80">
              Letakkan barang bawaanmu, lalu tutup pintu loker hingga berbunyi klik rapat.
            </p>
          </div>
        )}

        {/* QR Code Card */}
        <div className="flex flex-col items-center space-y-2.5">
          <div className="bg-white p-4 rounded-3xl border border-ink-line shadow-sm inline-block">
            {qrStoreDataUrl ? (
              <img
                src={qrStoreDataUrl}
                alt={`QR Buka Loker ${allocatedLocker}`}
                className="w-52 h-52 mx-auto rounded-xl"
              />
            ) : (
              <div className="w-52 h-52 bg-cream rounded-xl flex items-center justify-center font-mono text-xs text-ink-muted">
                Membuat QR Loker...
              </div>
            )}
            <div className="mt-2 pt-2 border-t border-ink-line/70 flex items-center justify-between gap-4 text-[11px] font-mono">
              <span className="text-ink-muted">UNIT</span>
              <span className="font-extrabold text-bloodwine">{allocatedLocker}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={!qrStoreDataUrl}
            onClick={handleDownloadQr}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-ink-line bg-white hover:bg-cream text-xs font-bold text-bloodwine transition-colors"
          >
            {downloadedQr ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>QR Tersimpan</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh QR Loker</span>
              </>
            )}
          </button>
        </div>

        {/* Compact Guard Code Backup Card */}
        <div className="bg-cream/80 border border-ink-line rounded-2xl p-4 flex items-center justify-between gap-3 text-left">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Kode Jaga (Cadangan &amp; Pengambilan)
            </div>
            <div className="text-2xl font-mono font-extrabold tracking-widest text-bloodwine mt-0.5">
              {guardCode}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-bloodwine-tint/40 border border-ink-line text-xs font-bold text-bloodwine transition-colors flex-shrink-0"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>

        {/* Primary Action Button */}
        {!isDoorOpen ? (
          <button
            type="button"
            onClick={onScanAndOpenDoor}
            className="w-full py-3.5 rounded-2xl bg-sunflare hover:bg-sunflare-hover active:scale-[0.98] text-bloodwine font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Unlock className="w-4 h-4" />
            <span>Simulasi Scan QR &amp; Buka Pintu</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onCloseDoorAndActivate}
            className="w-full py-3.5 rounded-2xl bg-bloodwine hover:bg-bloodwine-hover active:scale-[0.98] text-white font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-sunflare" />
            <span>Saya Sudah Menutup Pintu Loker</span>
          </button>
        )}
      </div>
    </div>
  );
}
