'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  Download,
  Check,
  ArrowLeft,
  RotateCw,
  AlertCircle,
} from 'lucide-react';
import { CFG } from '@/lib/data';
import { rupiah, pad } from '@/lib/engine';
import { LockerSize, LocationConfig } from '@/types/locker';

const PAYMENT_TIMEOUT_SECONDS = 600; // 10 menit standar QRIS

interface PaymentStepProps {
  qrPayDataUrl: string;
  rentalId: string;
  loc: LocationConfig;
  selectedSize: LockerSize;
  selectedHours: number;
  basePrice: number;
  onSimulatePayment: () => void;
  onBack: () => void;
}

export default function PaymentStep({
  qrPayDataUrl,
  rentalId,
  loc,
  selectedSize,
  selectedHours,
  basePrice,
  onSimulatePayment,
  onBack,
}: PaymentStepProps) {
  const [secondsLeft, setSecondsLeft] = useState(PAYMENT_TIMEOUT_SECONDS);
  const [downloaded, setDownloaded] = useState(false);

  // Reset countdown whenever a new rentalId is generated
  useEffect(() => {
    setSecondsLeft(PAYMENT_TIMEOUT_SECONDS);
  }, [rentalId]);

  // 1-second live countdown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const isExpired = secondsLeft <= 0;
  const isUrgent = secondsLeft > 0 && secondsLeft <= 60;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTimer = `${pad(mins)}:${pad(secs)}`;

  const handleDownloadQr = () => {
    if (!qrPayDataUrl || isExpired) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const width = 600;
      const height = 760;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        triggerDownload(qrPayDataUrl);
        return;
      }

      // Crisp white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Top Bloodwine accent bar
      ctx.fillStyle = '#780115';
      ctx.fillRect(0, 0, width, 16);

      // Brand title
      ctx.fillStyle = '#780115';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LocknGo QRIS', width / 2, 74);

      // Subtitle
      ctx.fillStyle = '#6E6268';
      ctx.font = '18px sans-serif';
      ctx.fillText(
        `${loc.name} - ${CFG.sizes[selectedSize].name} (${selectedHours} Jam)`,
        width / 2,
        108
      );

      // QR image centered with generous quiet zone
      const qrSize = 400;
      const qrX = (width - qrSize) / 2;
      const qrY = 140;
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

      // NMID
      ctx.fillStyle = '#2B1A1D';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('NMID: ID102003884990', width / 2, 578);

      // Divider
      ctx.strokeStyle = '#EADFE2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 610);
      ctx.lineTo(width - 80, 610);
      ctx.stroke();

      // Amount label & value
      ctx.fillStyle = '#6E6268';
      ctx.font = '18px sans-serif';
      ctx.fillText('Total Tagihan', width / 2, 650);

      ctx.fillStyle = '#780115';
      ctx.font = 'bold 36px monospace';
      ctx.fillText(rupiah(basePrice), width / 2, 698);

      // Order reference
      ctx.fillStyle = '#6E6268';
      ctx.font = '14px monospace';
      ctx.fillText(`Ref: ${rentalId || 'LOCKNGO'}`, width / 2, 734);

      triggerDownload(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      triggerDownload(qrPayDataUrl);
    };

    img.src = qrPayDataUrl;
  };

  const triggerDownload = (dataUrl: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `LocknGo-QRIS-${rentalId || 'pembayaran'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-ink-line shadow-card overflow-hidden">
      <div className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-extrabold text-bloodwine tracking-tight">
            Bayar dengan QRIS
          </h1>
          <p className="text-ink-muted text-xs sm:text-sm max-w-md mx-auto">
            Scan langsung atau unduh QRIS untuk bayar lewat BCA Mobile, Mandiri, GoPay, OVO, DANA, atau ShopeePay.
          </p>
        </div>

        {/* Live Payment Countdown Bar */}
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-colors ${
            isExpired
              ? 'bg-red-50 border-red-200 text-red-700'
              : isUrgent
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-cream/80 border-ink-line text-ink'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            {isExpired ? (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            ) : (
              <Clock
                className={`w-4 h-4 flex-shrink-0 ${
                  isUrgent ? 'text-amber-700' : 'text-bloodwine'
                }`}
              />
            )}
            <span>
              {isExpired ? 'Waktu pembayaran habis' : 'Selesaikan pembayaran dalam'}
            </span>
          </div>

          <span
            className={`font-mono text-sm font-extrabold px-2.5 py-1 rounded-lg ${
              isExpired
                ? 'bg-red-100 text-red-700'
                : isUrgent
                ? 'bg-amber-200/70 text-amber-950'
                : 'bg-white border border-ink-line text-bloodwine'
            }`}
          >
            {formattedTimer}
          </span>
        </div>

        {/* QR Code Card + Download Action */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative bg-white p-4 sm:p-5 rounded-3xl border border-ink-line shadow-sm">
            {qrPayDataUrl ? (
              <img
                src={qrPayDataUrl}
                alt="QRIS LocknGo"
                className={`w-56 h-56 mx-auto rounded-xl transition-opacity ${
                  isExpired ? 'opacity-20 blur-[1px]' : 'opacity-100'
                }`}
              />
            ) : (
              <div className="w-56 h-56 bg-cream rounded-xl flex items-center justify-center font-mono text-xs text-ink-muted">
                Membuat QRIS...
              </div>
            )}

            {/* Expired Overlay */}
            {isExpired && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <button
                  type="button"
                  onClick={() => setSecondsLeft(PAYMENT_TIMEOUT_SECONDS)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bloodwine hover:bg-bloodwine-hover text-white text-xs font-bold shadow-md transition-all"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Buat QR Baru</span>
                </button>
              </div>
            )}

            <div className="mt-2.5 pt-2.5 border-t border-ink-line/70 text-center text-[11px] font-mono font-bold text-ink-muted">
              NMID: ID102003884990
            </div>
          </div>

          {/* Download QR Button */}
          <button
            type="button"
            disabled={!qrPayDataUrl || isExpired}
            onClick={handleDownloadQr}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-ink-line bg-white hover:bg-cream hover:border-bloodwine/40 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-bloodwine transition-all active:scale-[0.98]"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>QRIS Tersimpan</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh QRIS (.PNG)</span>
              </>
            )}
          </button>
        </div>

        {/* Order & Amount Summary */}
        <div className="bg-sunflare-light/70 p-4 rounded-2xl border border-sunflare/50 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
              Total Tagihan
            </div>
            <div className="text-xs text-ink-muted truncate mt-0.5">
              {loc.name} · {CFG.sizes[selectedSize].name} · {selectedHours} Jam
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-bloodwine font-mono flex-shrink-0">
            {rupiah(basePrice)}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            disabled={isExpired}
            onClick={onSimulatePayment}
            className="w-full py-3.5 rounded-2xl bg-sunflare hover:bg-sunflare-hover active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed text-bloodwine font-extrabold text-sm sm:text-base shadow-sm transition-all"
          >
            Konfirmasi Bayar Berhasil (Simulasi)
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-xs text-ink-muted hover:text-bloodwine font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ubah lokasi atau durasi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
