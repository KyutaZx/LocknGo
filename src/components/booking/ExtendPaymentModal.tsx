'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Clock, Download, Check } from 'lucide-react';
import { rupiah, fmtDateTime, pad } from '@/lib/engine';

const EXTEND_QR_TIMEOUT_SECONDS = 300; // 5 menit

interface ExtendPaymentModalProps {
  extraHours: number;
  amount: number;
  allocatedLocker: string;
  rentalId: string;
  locationName: string;
  newEndAt: number;
  isSubmitting?: boolean;
  onConfirmPay: () => Promise<void> | void;
  onCancel: () => void;
}

export default function ExtendPaymentModal({
  extraHours,
  amount,
  allocatedLocker,
  rentalId,
  locationName,
  newEndAt,
  isSubmitting = false,
  onConfirmPay,
  onCancel,
}: ExtendPaymentModalProps) {
  const [qrUrl, setQrUrl] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(EXTEND_QR_TIMEOUT_SECONDS);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(
      `00020101021126590014ID.LINKAJA.WWW01189360091800000000005204581253033605802ID5908LOCKNGO6008SURABAYA62150703EXT${extraHours}H${rentalId}630489F3`
    ).then(setQrUrl);
    setSecondsLeft(EXTEND_QR_TIMEOUT_SECONDS);
  }, [extraHours, rentalId]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const isExpired = secondsLeft <= 0;

  const triggerDownload = (dataUrl: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `LocknGo-QRIS-Perpanjang-${allocatedLocker}-${rentalId || 'extend'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrUrl || isExpired) return;
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
        triggerDownload(qrUrl);
        return;
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#780115';
      ctx.fillRect(0, 0, width, 16);
      ctx.fillStyle = '#780115';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LocknGo QRIS Perpanjangan', width / 2, 74);
      ctx.fillStyle = '#6E6268';
      ctx.font = '18px sans-serif';
      ctx.fillText(
        `${locationName} · Loker ${allocatedLocker} (+${extraHours} Jam)`,
        width / 2,
        108
      );
      const qrSize = 400;
      ctx.drawImage(img, (width - qrSize) / 2, 140, qrSize, qrSize);
      ctx.fillStyle = '#2B1A1D';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('NMID: ID102003884990', width / 2, 578);
      ctx.strokeStyle = '#EADFE2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 610);
      ctx.lineTo(width - 80, 610);
      ctx.stroke();
      ctx.fillStyle = '#6E6268';
      ctx.font = '18px sans-serif';
      ctx.fillText('Total Perpanjangan', width / 2, 650);
      ctx.fillStyle = '#780115';
      ctx.font = 'bold 36px monospace';
      ctx.fillText(rupiah(amount), width / 2, 698);
      ctx.fillStyle = '#6E6268';
      ctx.font = '14px monospace';
      ctx.fillText(`Ref: ${rentalId || 'LOCKNGO'}`, width / 2, 734);
      triggerDownload(canvas.toDataURL('image/png'));
    };
    img.onerror = () => triggerDownload(qrUrl);
    img.src = qrUrl;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="extend-pay-title"
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white w-full max-w-md rounded-3xl border border-ink-line shadow-xl overflow-hidden animate-fadeIn">
        <div className="px-6 py-4 border-b border-ink-line flex items-center justify-between gap-3">
          <div>
            <h2
              id="extend-pay-title"
              className="text-base font-extrabold text-bloodwine"
            >
              Bayar Perpanjangan via QRIS
            </h2>
            <p className="text-xs text-ink-muted">
              Loker {allocatedLocker} · {locationName}
            </p>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            aria-label="Tutup pembayaran perpanjangan"
            className="p-2 rounded-xl text-ink-soft hover:text-bloodwine hover:bg-cream transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Countdown bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-cream border border-ink-line text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink-muted">
              <Clock className="w-3.5 h-3.5 text-bloodwine" />
              {isExpired ? 'QR kedaluwarsa' : 'Selesaikan pembayaran dalam'}
            </span>
            <span
              className={`font-mono font-extrabold ${
                isExpired ? 'text-red-600' : 'text-bloodwine'
              }`}
            >
              {pad(mins)}:{pad(secs)}
            </span>
          </div>

          {/* QR Code + Download */}
          <div className="flex flex-col items-center space-y-2.5">
            <div className="bg-white p-3.5 rounded-2xl border border-ink-line shadow-sm">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="QRIS Perpanjangan LocknGo"
                  className={`w-44 h-44 rounded-xl transition-opacity ${
                    isExpired ? 'opacity-25' : 'opacity-100'
                  }`}
                />
              ) : (
                <div className="w-44 h-44 rounded-xl bg-cream flex items-center justify-center font-mono text-xs text-ink-muted">
                  Membuat QRIS...
                </div>
              )}
              <div className="mt-2 pt-2 border-t border-ink-line/70 text-center text-[10px] font-mono font-bold text-ink-muted">
                NMID: ID102003884990
              </div>
            </div>

            <button
              type="button"
              disabled={!qrUrl || isExpired}
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

          {/* Summary */}
          <div className="bg-sunflare-light/70 p-4 rounded-2xl border border-sunflare/50 space-y-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs font-bold text-ink-muted">
                Tambah +{extraHours} Jam
              </span>
              <span className="text-2xl font-extrabold font-mono text-bloodwine">
                {rupiah(amount)}
              </span>
            </div>
            <div className="text-[11px] text-ink-muted font-mono">
              Berakhir baru: {fmtDateTime(newEndAt)}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              type="button"
              disabled={isSubmitting || isExpired}
              onClick={onConfirmPay}
              className="w-full py-3.5 rounded-2xl bg-sunflare hover:bg-sunflare-hover active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed text-bloodwine font-extrabold text-sm shadow-sm transition-all"
            >
              {isSubmitting
                ? 'Memproses perpanjangan...'
                : `Konfirmasi Bayar ${rupiah(amount)} (Simulasi)`}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onCancel}
              className="w-full py-2 text-xs font-semibold text-ink-muted hover:text-bloodwine transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
