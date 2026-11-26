'use client';

import { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  KeyRound,
  Unlock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Check,
  RotateCw,
  ArrowLeft,
} from 'lucide-react';
import { rupiah, pad } from '@/lib/engine';
import { LocationConfig } from '@/types/locker';

const PICKUP_QR_SECONDS = 600; // 10 menit

type PickupMethod = 'qr' | 'code';

interface PickupStepProps {
  allocatedLocker: string;
  rentalId: string;
  loc: LocationConfig;
  qrPickupDataUrl: string;
  pickupGuardInput: string;
  setPickupGuardInput: (val: string) => void;
  pickupGuardError: string;
  guardLockSeconds?: number;
  isLate: boolean;
  lateAmount: number;
  latePaid: boolean;
  isDoorOpen: boolean;
  doorCountdown: number;
  onPayLateFee: () => void;
  onScanQrPickup: () => void;
  onVerifyPickup: (e: React.FormEvent) => void;
  onFinishRental: () => void;
  onKeepRental: () => void;
  onBackToActive: () => void;
}

export default function PickupStep({
  allocatedLocker,
  rentalId,
  loc,
  qrPickupDataUrl,
  pickupGuardInput,
  setPickupGuardInput,
  pickupGuardError,
  guardLockSeconds = 0,
  isLate,
  lateAmount,
  latePaid,
  isDoorOpen,
  doorCountdown,
  onPayLateFee,
  onScanQrPickup,
  onVerifyPickup,
  onFinishRental,
  onKeepRental,
  onBackToActive,
}: PickupStepProps) {
  const [method, setMethod] = useState<PickupMethod>('qr');
  const [qrSecondsLeft, setQrSecondsLeft] = useState(PICKUP_QR_SECONDS);
  const [downloadedQr, setDownloadedQr] = useState(false);
  const digitRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Live 10-minute QR expiry countdown
  useEffect(() => {
    if (isDoorOpen || qrSecondsLeft <= 0) return;
    const interval = setInterval(() => {
      setQrSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isDoorOpen, qrSecondsLeft]);

  // Auto-focus first digit box when switching to Kode Jaga tab
  useEffect(() => {
    if (method === 'code' && !isDoorOpen && (!isLate || latePaid)) {
      const t = setTimeout(() => digitRefs.current[0]?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [method, isDoorOpen, isLate, latePaid]);

  const isQrExpired = qrSecondsLeft <= 0;
  const qrTimerText = `${pad(Math.floor(qrSecondsLeft / 60))}:${pad(qrSecondsLeft % 60)}`;

  const doorMins = Math.floor(doorCountdown / 60);
  const doorSecs = doorCountdown % 60;
  const formattedDoorTime =
    doorMins > 0 ? `${doorMins} menit ${doorSecs} detik` : `${doorSecs} detik`;

  const digits = Array.from({ length: 6 }, (_, i) => pickupGuardInput[i] || '');

  const handleDigitChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      setPickupGuardInput(next.join(''));
      return;
    }

    if (cleaned.length > 1) {
      const next = [...digits];
      for (let i = 0; i < cleaned.length && index + i < 6; i++) {
        next[index + i] = cleaned[i];
      }
      setPickupGuardInput(next.join('').slice(0, 6));
      digitRefs.current[Math.min(index + cleaned.length, 5)]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = cleaned;
    setPickupGuardInput(next.join(''));
    if (index < 5) {
      digitRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      setPickupGuardInput(next.join(''));
      digitRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      digitRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      digitRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    setPickupGuardInput(pasted);
    digitRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleDownloadQr = () => {
    if (!qrPickupDataUrl || isQrExpired) return;
    const link = document.createElement('a');
    link.href = qrPickupDataUrl;
    link.download = `LocknGo-QR-Ambil-${allocatedLocker}-${rentalId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadedQr(true);
    setTimeout(() => setDownloadedQr(false), 1800);
  };

  const canAccessLocker = !isLate || latePaid;
  const isGuardLocked = guardLockSeconds > 0;

  return (
    <div className="bg-white rounded-3xl border border-ink-line shadow-card overflow-hidden">
      <div className="p-6 sm:p-8 space-y-6 text-center">
        {/* Header */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-extrabold text-bloodwine tracking-tight">
            {isDoorOpen
              ? `Pintu Loker ${allocatedLocker} Terbuka`
              : `Ambil Barang dari Loker ${allocatedLocker}`}
          </h1>
          <p className="text-ink-muted text-xs sm:text-sm">
            {isDoorOpen
              ? `Ambil barangmu di ${loc.name} dan pastikan tidak ada yang tertinggal.`
              : `Pilih cara buka loker di ${loc.name}: scan QR atau masukkan 6 digit kode jaga.`}
          </p>
        </div>

        {/* Late Fee Payment Notice */}
        {isLate && !latePaid && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-left space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <span>Kelebihan Waktu Sewa</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Waktu sewa telah berakhir. Tagihan denda sebesar{' '}
              <strong className="font-mono text-sm text-bloodwine">
                {rupiah(lateAmount)}
              </strong>{' '}
              harus diselesaikan sebelum pintu loker dapat dibuka.
            </p>
            <button
              type="button"
              onClick={onPayLateFee}
              className="w-full py-3 rounded-xl bg-bloodwine hover:bg-bloodwine-hover text-white font-bold text-xs shadow-sm transition-colors"
            >
              Bayar Denda ({rupiah(lateAmount)}) via QRIS
            </button>
          </div>
        )}

        {/* Dual-Mode Pickup Tabs (QR or Guard Code) */}
        {canAccessLocker && !isDoorOpen && (
          <div className="space-y-5">
            {/* Segmented Switcher */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-cream border border-ink-line">
              <button
                type="button"
                onClick={() => setMethod('qr')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  method === 'qr'
                    ? 'bg-bloodwine text-white shadow-sm'
                    : 'text-ink-muted hover:text-bloodwine'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Scan QR</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('code')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                  method === 'code'
                    ? 'bg-bloodwine text-white shadow-sm'
                    : 'text-ink-muted hover:text-bloodwine'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Kode Jaga</span>
              </button>
            </div>

            {method === 'qr' ? (
              <div className="space-y-4">
                {/* Live QR Expiry Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-cream/80 border border-ink-line text-xs">
                  <span className="font-semibold text-ink-muted flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-bloodwine" />
                    {isQrExpired ? 'QR sudah kedaluwarsa' : 'Masa berlaku QR'}
                  </span>
                  <span
                    className={`font-mono font-extrabold ${
                      isQrExpired ? 'text-red-600' : 'text-bloodwine'
                    }`}
                  >
                    {qrTimerText}
                  </span>
                </div>

                {/* QR Frame */}
                <div className="flex flex-col items-center space-y-2.5">
                  <div className="relative bg-white p-4 rounded-3xl border border-ink-line shadow-sm inline-block">
                    {qrPickupDataUrl ? (
                      <img
                        src={qrPickupDataUrl}
                        alt={`QR Pickup Loker ${allocatedLocker}`}
                        className={`w-52 h-52 mx-auto rounded-xl transition-opacity ${
                          isQrExpired ? 'opacity-20 blur-[1px]' : 'opacity-100'
                        }`}
                      />
                    ) : (
                      <div className="w-52 h-52 bg-cream rounded-xl flex items-center justify-center font-mono text-xs text-ink-muted">
                        Membuat QR...
                      </div>
                    )}

                    {isQrExpired && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setQrSecondsLeft(PICKUP_QR_SECONDS)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bloodwine text-white text-xs font-bold shadow-md"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Buat QR Baru</span>
                        </button>
                      </div>
                    )}

                    <div className="mt-2 pt-2 border-t border-ink-line/70 flex items-center justify-between gap-4 text-[11px] font-mono">
                      <span className="text-ink-muted">LOKER</span>
                      <span className="font-extrabold text-bloodwine">{allocatedLocker}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!qrPickupDataUrl || isQrExpired}
                    onClick={handleDownloadQr}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-ink-line bg-white hover:bg-cream disabled:opacity-40 text-xs font-bold text-bloodwine transition-colors"
                  >
                    {downloadedQr ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>QR Tersimpan</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh QR Pickup</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Simulate QR Scan Button */}
                <button
                  type="button"
                  disabled={isQrExpired}
                  onClick={onScanQrPickup}
                  className="w-full py-3.5 rounded-2xl bg-sunflare hover:bg-sunflare-hover active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed text-bloodwine font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Simulasi Scan QR &amp; Buka Loker</span>
                </button>
              </div>
            ) : (
              <form onSubmit={onVerifyPickup} className="space-y-5 text-left">
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted text-center">
                    Masukkan 6 Digit Kode Jaga
                  </label>

                  <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handleDigitPaste}>
                    {digits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          digitRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        disabled={isGuardLocked}
                        value={digit}
                        aria-label={`Digit Kode Jaga ${i + 1}`}
                        onChange={(e) => handleDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(i, e)}
                        className={`w-full h-13 sm:h-14 rounded-2xl border text-center font-mono text-xl sm:text-2xl font-extrabold text-bloodwine bg-white transition-all focus:outline-none focus:border-bloodwine focus:ring-4 focus:ring-bloodwine/10 disabled:opacity-45 disabled:bg-cream/60 disabled:cursor-not-allowed ${
                          digit
                            ? 'border-bloodwine/60 bg-bloodwine-tint/20'
                            : 'border-ink-line'
                        }`}
                      />
                    ))}
                  </div>

                  {isGuardLocked ? (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-center font-semibold">
                      Terlalu banyak percobaan salah. Coba lagi dalam{' '}
                      <span className="font-mono font-extrabold text-bloodwine">
                        00:{pad(guardLockSeconds)}
                      </span>
                      .
                    </div>
                  ) : pickupGuardError ? (
                    <p className="text-xs font-semibold text-red-600 text-center">
                      {pickupGuardError}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={pickupGuardInput.length < 6 || isGuardLocked}
                  className="w-full py-3.5 rounded-2xl bg-sunflare hover:bg-sunflare-hover active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed text-bloodwine font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>
                    {isGuardLocked
                      ? `Terkunci (${guardLockSeconds}d)`
                      : 'Buka Pintu Loker'}
                  </span>
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={onBackToActive}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-bloodwine transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke status sewa</span>
            </button>
          </div>
        )}

        {/* Door Opened Banner */}
        {isDoorOpen && (
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Pintu terbuka selama {formattedDoorTime}</span>
              </div>
              <p className="text-xs text-emerald-900/80">
                Ambil barangmu sekarang, lalu tutup pintu loker kembali.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onFinishRental}
                className="py-3.5 px-4 rounded-2xl bg-bloodwine hover:bg-bloodwine-hover active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all"
              >
                Ambil Semua &amp; Selesai
              </button>
              <button
                type="button"
                onClick={onKeepRental}
                className="py-3.5 px-4 rounded-2xl bg-white border border-ink-line hover:bg-cream text-ink font-bold text-xs sm:text-sm transition-colors"
              >
                Ambil Sebagian (Lanjut Sewa)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
