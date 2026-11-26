'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Clock } from 'lucide-react';
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

          {/* QR Code */}
          <div className="flex flex-col items-center">
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
