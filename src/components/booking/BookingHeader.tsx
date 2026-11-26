'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, RotateCcw, ArrowLeft, LogOut, Bell, MessageSquare } from 'lucide-react';
import { BookingStep, STEPS_ORDER, STEP_LABELS } from '@/hooks/useBookingFlow';
import { SimNotification } from '@/components/booking/NotificationToast';

interface BookingHeaderProps {
  currentStep: BookingStep;
  isLoggedIn?: boolean;
  notifications?: SimNotification[];
  onMarkNotificationsRead?: () => void;
  onNotificationAction?: (notif: SimNotification) => void;
  onReset: () => void;
  onLogout?: () => void;
}

export default function BookingHeader({
  currentStep,
  isLoggedIn,
  notifications = [],
  onMarkNotificationsRead,
  onNotificationAction,
  onReset,
  onLogout,
}: BookingHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<HTMLDivElement>(null);

  const hasActiveLocker =
    currentStep === 'store' ||
    currentStep === 'active' ||
    currentStep === 'pickup';

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (resetRef.current && !resetRef.current.contains(e.target as Node)) {
        setConfirmResetOpen(false);
      }
    };
    if (notifOpen || confirmResetOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [notifOpen, confirmResetOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentIdx = STEPS_ORDER.indexOf(currentStep);
  const progressPct = ((currentIdx + 1) / STEPS_ORDER.length) * 100;

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ink-line">
      {/* Topbar */}
      <header className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group" aria-label="Kembali ke beranda LocknGo">
          <Image
            src="/assets/logo.png"
            alt="LocknGo"
            width={120}
            height={38}
            className="h-9 w-auto object-contain transition-transform group-hover:scale-[1.03]"
            priority
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Simulated Notification Inbox Bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                const next = !notifOpen;
                setNotifOpen(next);
                if (next && onMarkNotificationsRead) onMarkNotificationsRead();
              }}
              aria-label="Riwayat notifikasi simulasi"
              className="relative p-2 rounded-xl text-ink-muted hover:text-bloodwine hover:bg-cream border border-transparent hover:border-ink-line transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-bloodwine text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-white rounded-2xl border border-ink-line shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-ink-line bg-cream/50 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-bloodwine">
                    Riwayat Notifikasi (Simulasi WA)
                  </span>
                  <span className="text-[10px] font-mono text-ink-soft">
                    {notifications.length} pesan
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-ink-line/70">
                  {notifications.length === 0 ? (
                    <div className="py-8 px-4 text-center text-xs text-ink-soft">
                      Belum ada notifikasi. Pesan OTP, konfirmasi bayar, dan pengingat 30 menit / 10 menit akan muncul di sini.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-3.5 hover:bg-cream/30 transition-colors">
                        <div className="flex items-center justify-between gap-2 text-[10px] text-ink-soft font-mono">
                          <span className="inline-flex items-center gap-1 font-bold text-bloodwine">
                            <MessageSquare className="w-3 h-3" />
                            {n.channel}
                          </span>
                          <span>{n.timeLabel}</span>
                        </div>
                        <div className="text-xs font-bold text-ink mt-1">{n.title}</div>
                        <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                        {n.actionLabel && onNotificationAction && (
                          <button
                            type="button"
                            onClick={() => {
                              setNotifOpen(false);
                              onNotificationAction(n);
                            }}
                            className="mt-2 px-3 py-1 rounded-lg bg-sunflare hover:bg-sunflare-hover text-bloodwine font-bold text-[11px] transition-colors"
                          >
                            {n.actionLabel}
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-bloodwine px-3 py-2 rounded-xl hover:bg-cream transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>

          <div className="relative" ref={resetRef}>
            <button
              type="button"
              onClick={() => {
                if (hasActiveLocker) {
                  setConfirmResetOpen((o) => !o);
                } else {
                  onReset();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-bloodwine bg-cream hover:bg-bloodwine hover:text-white border border-ink-line hover:border-bloodwine px-3.5 py-2 rounded-xl transition-all duration-150 active:scale-[0.98]"
              title="Mulai ulang sesi pemesanan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {confirmResetOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-ink-line shadow-xl z-50 p-4 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-bloodwine">
                    Reset tampilan sesi ini?
                  </p>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    Loker aktif tetap tercatat di database dan akan pulih otomatis saat kamu masuk lagi.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmResetOpen(false)}
                    className="px-3 py-1.5 rounded-xl border border-ink-line bg-white hover:bg-cream text-xs font-bold text-ink transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmResetOpen(false);
                      onReset();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-bloodwine hover:bg-bloodwine-hover text-white text-xs font-bold transition-colors"
                  >
                    Ya, Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {isLoggedIn && onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 px-3 py-2 rounded-xl transition-colors"
              title="Keluar dari akun dan hapus sesi tersimpan"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          )}
        </div>
      </header>

      {/* Dot-Node Stepper (Centered Labels Below Nodes) */}
      <div className="border-t border-ink-line/70 bg-white py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Desktop / Tablet Horizontal Dot Stepper */}
          <nav
            aria-label="Tahapan pemesanan loker"
            className="hidden md:grid grid-cols-7 relative"
          >
            {STEPS_ORDER.map((s, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isFirst = idx === 0;
              const isLast = idx === STEPS_ORDER.length - 1;

              return (
                <div key={s} className="relative flex flex-col items-center">
                  {/* Left half connector */}
                  {!isFirst && (
                    <div
                      className={`absolute top-4 right-1/2 left-0 h-[2px] -translate-y-1/2 transition-colors duration-300 ${
                        idx <= currentIdx ? 'bg-bloodwine' : 'bg-ink-line'
                      }`}
                    />
                  )}
                  {/* Right half connector */}
                  {!isLast && (
                    <div
                      className={`absolute top-4 left-1/2 right-0 h-[2px] -translate-y-1/2 transition-colors duration-300 ${
                        idx < currentIdx ? 'bg-bloodwine' : 'bg-ink-line'
                      }`}
                    />
                  )}

                  {/* Circle Node */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isPast
                        ? 'bg-bloodwine text-white'
                        : isCurrent
                        ? 'bg-bloodwine ring-4 ring-bloodwine/20'
                        : 'bg-cream border-2 border-ink-line'
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-white" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-ink-line" />
                    )}
                  </div>

                  {/* Step Number + Label Below Node */}
                  <div className="mt-2 text-center leading-tight">
                    <div
                      className={`text-[11px] font-bold ${
                        isCurrent
                          ? 'text-bloodwine'
                          : isPast
                          ? 'text-ink'
                          : 'text-ink-muted'
                      }`}
                    >
                      Langkah {idx + 1}
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        isCurrent
                          ? 'text-bloodwine font-semibold'
                          : 'text-ink-soft font-medium'
                      }`}
                    >
                      {STEP_LABELS[s]}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Mobile Compact Stepper */}
          <div className="md:hidden flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-white bg-bloodwine px-2 py-0.5 rounded-full">
                Langkah {currentIdx + 1}/{STEPS_ORDER.length}
              </span>
              <span className="font-extrabold text-bloodwine">
                {STEP_LABELS[currentStep]}
              </span>
            </div>
            <div className="w-28 h-1.5 bg-ink-line rounded-full overflow-hidden">
              <div
                className="h-full bg-bloodwine transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
