'use client';

import Link from 'next/link';
import { CFG } from '@/lib/data';
import {
  rupiah,
  fmtDur,
  fmtClock,
  fmtDateTime,
  priceOf,
  extendPrice,
  canFitDuration,
  prettyPhone,
} from '@/lib/engine';
import { LockerSize } from '@/types/locker';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import BookingHeader from '@/components/booking/BookingHeader';
import TimeSimulatorFooter from '@/components/booking/TimeSimulatorFooter';
import LoginStep from '@/components/booking/LoginStep';
import ConfigureStep from '@/components/booking/ConfigureStep';
import PaymentStep from '@/components/booking/PaymentStep';
import StoreStep from '@/components/booking/StoreStep';
import PickupStep from '@/components/booking/PickupStep';
import NotificationToast from '@/components/booking/NotificationToast';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Lock,
  Unlock,
  KeyRound,
  QrCode as QrIcon,
  ShieldCheck,
  Info,
} from 'lucide-react';

export default function BookingPage() {
  const {
    currentStep,
    setCurrentStep,
    phoneInput,
    setPhoneInput,
    otpInput,
    setOtpInput,
    generatedOtp,
    setGeneratedOtp,
    phoneError,
    otpError,
    isLoggedIn,
    selectedLocationId,
    setSelectedLocationId,
    selectedSize,
    setSelectedSize,
    selectedHours,
    setSelectedHours,
    agreedTerms,
    setAgreedTerms,
    loc,
    canFit,
    blockReason,
    availability,
    isSubmitting,
    actionError,
    resetSignal,
    rentalId,
    allocatedLocker,
    guardCode,
    basePrice,
    totalPaid,
    rentalEndAt,
    qrPayDataUrl,
    qrStoreDataUrl,
    qrPickupDataUrl,
    isDoorOpen,
    setIsDoorOpen,
    doorCountdown,
    currentTime,
    timeOffset,
    remainingMs,
    isOverdue,
    lateInfo,
    extensionSuccess,
    extensionError,
    pickupGuardInput,
    setPickupGuardInput,
    pickupGuardError,
    guardLockSeconds,
    isLate,
    lateAmount,
    latePaid,
    handleRequestOtp,
    handleVerifyOtp,
    handleProceedToPay,
    handleOpenLoginCheck,
    handleBackFromLogin,
    handleBackFromPay,
    handleSimulatePayment,
    handleOpenStoreDoor,
    handleCloseDoorAndActivate,
    handleExtendRental,
    handleGoToPickup,
    handleScanQrPickup,
    handleVerifyPickup,
    handlePayLateFee,
    handleFinishRental,
    handleResetAll,
    handleLogout,
    notifications,
    activeToast,
    dismissToast,
    markAllNotificationsRead,
    handleSimulateReminderNotif,
  } = useBookingFlow();

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between">
      <BookingHeader
        currentStep={currentStep}
        isLoggedIn={isLoggedIn}
        notifications={notifications}
        onMarkNotificationsRead={markAllNotificationsRead}
        onReset={handleResetAll}
        onLogout={handleLogout}
      />

      <NotificationToast toast={activeToast} onDismiss={dismissToast} />

      {/* Main Form Content Wrap */}
      <main
        className={`${
          currentStep === 'select' ? 'max-w-4xl' : 'max-w-xl'
        } mx-auto w-full px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center`}
      >
        {/* ================= STEP 1: LOGIN ================= */}
        {currentStep === 'login' && (
          <LoginStep
            phoneInput={phoneInput}
            setPhoneInput={setPhoneInput}
            otpInput={otpInput}
            setOtpInput={setOtpInput}
            generatedOtp={generatedOtp}
            setGeneratedOtp={setGeneratedOtp}
            phoneError={phoneError}
            otpError={otpError}
            onRequestOtp={handleRequestOtp}
            onVerifyOtp={handleVerifyOtp}
          />
        )}

        {/* ================= STEP 2: SELECT ================= */}
        {currentStep === 'select' && (
          <ConfigureStep
            selectedLocationId={selectedLocationId}
            setSelectedLocationId={setSelectedLocationId}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedHours={selectedHours}
            setSelectedHours={setSelectedHours}
            loc={loc}
            currentTime={currentTime}
            canFit={canFit}
            blockReason={blockReason}
            availability={availability}
            isSubmitting={isSubmitting}
            actionError={actionError}
            resetSignal={resetSignal}
            isLoggedIn={isLoggedIn}
            onProceedToPay={handleProceedToPay}
          />
        )}

        {/* ================= STEP 3: QRIS PAYMENT ================= */}
        {currentStep === 'pay' && (
          <PaymentStep
            qrPayDataUrl={qrPayDataUrl}
            rentalId={rentalId}
            loc={loc}
            selectedSize={selectedSize}
            selectedHours={selectedHours}
            basePrice={basePrice}
            onSimulatePayment={handleSimulatePayment}
            onBack={handleBackFromPay}
          />
        )}

        {/* ================= STEP 4: STORE / TITIP ================= */}
        {currentStep === 'store' && (
          <StoreStep
            qrStoreDataUrl={qrStoreDataUrl}
            rentalId={rentalId}
            allocatedLocker={allocatedLocker}
            guardCode={guardCode}
            loc={loc}
            isDoorOpen={isDoorOpen}
            doorCountdown={doorCountdown}
            onScanAndOpenDoor={handleOpenStoreDoor}
            onCloseDoorAndActivate={handleCloseDoorAndActivate}
          />
        )}

        {/* ================= STEP 5: ACTIVE DASHBOARD ================= */}
        {currentStep === 'active' && (
          <div className="space-y-6">
            {/* Active Rental Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink-line shadow-card space-y-6">
              <div className="flex items-center justify-between border-b border-ink-line pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    Sewa Sedang Aktif
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-bloodwine bg-cream px-2.5 py-1 rounded-lg border border-ink-line">
                  {rentalId}
                </span>
              </div>

              {/* Timer Countdown Big Display */}
              <div className="text-center py-4 space-y-2 bg-cream-subtle rounded-3xl border border-ink-line">
                <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  {isOverdue ? 'Waktu Telat Berjalan' : 'Sisa Waktu Sewa'}
                </span>
                <div
                  className={`text-5xl sm:text-6xl font-mono font-extrabold tracking-tight ${
                    isOverdue ? 'text-red-600' : 'text-bloodwine'
                  }`}
                >
                  {fmtDur(Math.abs(remainingMs))}
                </div>
                <p className="text-xs text-ink-soft">
                  Berakhir: {fmtDateTime(rentalEndAt)}
                </p>
              </div>

              {/* Overdue Warning & Fee Calculation */}
              {isOverdue && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>
                      {lateInfo.overCap
                        ? 'Melewati Batas 24 Jam — Barang Diamankan Petugas'
                        : 'Waktu Sewa Telah Habis'}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {lateInfo.overCap ? (
                      <>
                        Keterlambatan sudah lebih dari 24 jam. Denda berhenti di batas maksimal{' '}
                        <strong className="font-mono text-sm">{rupiah(lateInfo.amount)}</strong>{' '}
                        dan barang diamankan oleh petugas LocknGo (disimpan hingga 7 hari).
                      </>
                    ) : (
                      <>
                        Keterlambatan {lateInfo.minutes} menit ({lateInfo.blocks} blok 5 menit). Denda saat ini:{' '}
                        <strong className="font-mono text-sm">{rupiah(lateInfo.amount)}</strong>{' '}
                        (maksimal {rupiah(CFG.late.maxPerDay)} / 24 jam).
                      </>
                    )}
                  </p>
                </div>
              )}

              {/* Extension notifications */}
              {extensionSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900">
                  {extensionSuccess}
                </div>
              )}
              {extensionError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900">
                  {extensionError}
                </div>
              )}

              {/* Locker Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-ink-line">
                  <span className="text-ink-soft block mb-1">Nomor Loker</span>
                  <strong className="text-lg font-mono text-bloodwine">{allocatedLocker}</strong>
                </div>
                <div className="p-3 rounded-xl bg-white border border-ink-line">
                  <span className="text-ink-soft block mb-1">Kode Jaga</span>
                  <strong className="text-lg font-mono text-bloodwine">{guardCode}</strong>
                </div>
              </div>

              {/* Extension Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Perpanjang Waktu Sewa (Lebih Hemat)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleExtendRental(1)}
                    className="py-3 px-3 rounded-xl border border-bloodwine hover:bg-sunflare-light text-bloodwine font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    +1 Jam ({rupiah(extendPrice(selectedSize, 1))})
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExtendRental(3)}
                    className="py-3 px-3 rounded-xl border border-bloodwine hover:bg-sunflare-light text-bloodwine font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    +3 Jam ({rupiah(extendPrice(selectedSize, 3))})
                  </button>
                </div>
              </div>

              {/* Action Button: Pickup */}
              <button
                type="button"
                onClick={handleGoToPickup}
                className="w-full py-4 rounded-xl bg-sunflare hover:bg-sunflare-hover text-bloodwine font-bold text-base shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Unlock className="w-5 h-5" />
                Ambil Barang Sekarang
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 6: PICKUP ================= */}
        {currentStep === 'pickup' && (
          <PickupStep
            allocatedLocker={allocatedLocker}
            rentalId={rentalId}
            loc={loc}
            qrPickupDataUrl={qrPickupDataUrl}
            pickupGuardInput={pickupGuardInput}
            setPickupGuardInput={setPickupGuardInput}
            pickupGuardError={pickupGuardError}
            guardLockSeconds={guardLockSeconds}
            isLate={isLate}
            lateAmount={lateAmount}
            latePaid={latePaid}
            isDoorOpen={isDoorOpen}
            doorCountdown={doorCountdown}
            onPayLateFee={handlePayLateFee}
            onScanQrPickup={handleScanQrPickup}
            onVerifyPickup={handleVerifyPickup}
            onFinishRental={handleFinishRental}
            onKeepRental={() => {
              setIsDoorOpen(false);
              setCurrentStep('active');
            }}
            onBackToActive={() => setCurrentStep('active')}
          />
        )}

        {/* ================= STEP 7: DONE ================= */}
        {currentStep === 'done' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink-line shadow-card text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-sunflare-light text-bloodwine flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10 text-bloodwine" />
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-bloodwine">
                Selesai! Terima Kasih
              </h2>
              <p className="text-ink-muted text-sm mt-1">
                Loker {allocatedLocker} telah dikosongkan dan siap digunakan pengguna berikutnya.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-cream-subtle p-5 rounded-3xl border border-ink-line text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-ink-line/60 pb-2">
                <span className="text-ink-soft">Kode Booking</span>
                <span className="font-mono font-bold text-bloodwine">{rentalId}</span>
              </div>
              <div className="flex justify-between border-b border-ink-line/60 pb-2">
                <span className="text-ink-soft">Lokasi</span>
                <span className="font-bold text-ink">{loc.name}</span>
              </div>
              <div className="flex justify-between border-b border-ink-line/60 pb-2">
                <span className="text-ink-soft">Ukuran Loker</span>
                <span className="font-bold text-ink">{selectedSize} ({CFG.sizes[selectedSize].name})</span>
              </div>
              <div className="flex justify-between border-b border-ink-line/60 pb-2">
                <span className="text-ink-soft">Waktu Selesai</span>
                <span className="font-mono font-bold text-ink">{fmtDateTime(currentTime)}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-extrabold text-bloodwine">
                <span>Total Dibayar</span>
                <span className="font-mono">{rupiah(totalPaid)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleResetAll}
                className="w-full py-4 rounded-xl bg-sunflare hover:bg-sunflare-hover text-bloodwine font-bold text-sm shadow-md transition-all active:scale-98"
              >
                Sewa Loker Baru
              </button>

              <Link
                href="/"
                className="block text-xs text-ink-muted hover:text-bloodwine font-semibold"
              >
                Kembali ke Halaman Beranda
              </Link>
            </div>
          </div>
        )}
      </main>

      <TimeSimulatorFooter
        currentTime={currentTime}
        timeOffset={timeOffset}
        onSimulateNotif={handleSimulateReminderNotif}
      />
    </div>
  );
}
