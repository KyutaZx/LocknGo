'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { CFG } from '@/lib/data';
import {
  rupiah,
  pad,
  uid,
  Time,
  fmtClock,
  lateCapped,
  priceOf,
  extendPrice,
  canFitDuration,
  durationBlockReason,
  locById,
  validPhone,
  makeGuardCode,
  checkGuardCode,
} from '@/lib/engine';
import { createClient } from '@/lib/supabase/client';
import { LockerSize } from '@/types/locker';
import type {
  BookingWithLocker,
  LocationAvailabilityMap,
} from '@/services/bookingService';
import { SimNotification } from '@/components/booking/NotificationToast';
import {
  loadBookingSession,
  saveBookingSession,
  clearBookingSession,
  hasActiveLockerSession,
} from '@/lib/sessionStorage';

export type BookingStep =
  | 'login'
  | 'select'
  | 'pay'
  | 'store'
  | 'active'
  | 'pickup'
  | 'done';

export const STEP_LABELS: Record<BookingStep, string> = {
  login: 'Masuk',
  select: 'Pilih',
  pay: 'Bayar',
  store: 'Simpan',
  active: 'Berjalan',
  pickup: 'Ambil',
  done: 'Selesai',
};

export const STEPS_ORDER: BookingStep[] = [
  'login',
  'select',
  'pay',
  'store',
  'active',
  'pickup',
  'done',
];

function mapDbStatusToStep(status: BookingWithLocker['status']): BookingStep {
  if (status === 'pending_payment') return 'pay';
  if (status === 'paid_unclaimed') return 'store';
  if (status === 'active') return 'active';
  if (status === 'late') return 'pickup';
  if (status === 'completed') return 'done';
  return 'select';
}

export function useBookingFlow() {
  const [hydrated, setHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState<BookingStep>('login');
  const [pendingCheckout, setPendingCheckout] = useState(false);

  // User state
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('123456');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Selection state
  const [selectedLocationId, setSelectedLocationId] = useState<string>('tp1');
  const [selectedSize, setSelectedSize] = useState<LockerSize>('M');
  const [selectedHours, setSelectedHours] = useState<number>(3);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);

  // Live availability & async state
  const [availability, setAvailability] =
    useState<LocationAvailabilityMap | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  // Rental & Payment state
  const [bookingDbId, setBookingDbId] = useState('');
  const [rentalId, setRentalId] = useState('');
  const [allocatedLocker, setAllocatedLocker] = useState('');
  const [guardCode, setGuardCode] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [rentalStartAt, setRentalStartAt] = useState<number>(0);
  const [rentalEndAt, setRentalEndAt] = useState<number>(0);
  const [qrPayDataUrl, setQrPayDataUrl] = useState('');
  const [qrStoreDataUrl, setQrStoreDataUrl] = useState('');
  const [qrPickupDataUrl, setQrPickupDataUrl] = useState('');

  // Door simulation state
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [doorCountdown, setDoorCountdown] = useState(180);

  // Active rental countdown & virtual time
  const [currentTime, setCurrentTime] = useState(Time.now());
  const [timeOffset, setTimeOffset] = useState(Time.getOffset());
  const [extensionSuccess, setExtensionSuccess] = useState('');
  const [extensionError, setExtensionError] = useState('');

  // Pickup state
  const [pickupGuardInput, setPickupGuardInput] = useState('');
  const [pickupGuardError, setPickupGuardError] = useState('');
  const [pickupTries, setPickupTries] = useState(0);
  const [guardLockSeconds, setGuardLockSeconds] = useState(0);
  const [isLate, setIsLate] = useState(false);
  const [lateAmount, setLateAmount] = useState(0);
  const [latePaid, setLatePaid] = useState(false);

  // Simulated WhatsApp / Push Notifications state
  const [notifications, setNotifications] = useState<SimNotification[]>([]);
  const [activeToast, setActiveToast] = useState<SimNotification | null>(null);
  const reminderSentRef = useRef(false);
  const overdueSentRef = useRef(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushNotification = useCallback(
    (
      title: string,
      message: string,
      tone: SimNotification['tone'] = 'info',
      channel: SimNotification['channel'] = 'WhatsApp'
    ) => {
      const notif: SimNotification = {
        id: uid('NF-'),
        title,
        message,
        channel,
        timeLabel: `${fmtClock(Time.now())} WIB`,
        tone,
        read: false,
      };
      setNotifications((prev) => [notif, ...prev].slice(0, 15));
      setActiveToast(notif);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setActiveToast((curr) => (curr?.id === notif.id ? null : curr));
      }, 6000);
    },
    []
  );

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const refreshAvailability = useCallback(async () => {
    try {
      const res = await fetch('/api/availability', { cache: 'no-store' });
      if (!res.ok) return;
      const json = (await res.json()) as {
        success?: boolean;
        availability?: LocationAvailabilityMap;
      };
      if (json.success && json.availability) {
        setAvailability(json.availability);
      }
    } catch {
      // Keep previous availability on transient network error
    }
  }, []);

  // Load availability & subscribe to Supabase Realtime changes on `lockers`
  useEffect(() => {
    refreshAvailability();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || url.includes('mock.supabase.co')) return;

    const supabase = createClient();
    const channel = supabase
      .channel('lockers-availability')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lockers' },
        () => {
          refreshAvailability();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshAvailability]);

  // Virtual clock & door countdown loop
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Time.now();
      setCurrentTime(now);
      setTimeOffset(Time.getOffset());

      if (isDoorOpen && doorCountdown > 0) {
        setDoorCountdown((c) => c - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isDoorOpen, doorCountdown]);

  // Temporary cooldown countdown after 3 consecutive wrong guard code attempts
  useEffect(() => {
    if (guardLockSeconds <= 0) return;
    const timer = setInterval(() => {
      setGuardLockSeconds((prev) => {
        if (prev <= 1) {
          setPickupTries(0);
          setPickupGuardError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [guardLockSeconds]);

  // Hydrate persisted session & optional URL query params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = loadBookingSession();
    const hasActive = hasActiveLockerSession(saved);

    if (saved && saved.isLoggedIn) {
      setPhoneInput(saved.phoneInput || '');
      setIsLoggedIn(true);
      setCurrentStep(saved.currentStep || 'select');
      if (saved.selectedLocationId && locById(saved.selectedLocationId)) {
        setSelectedLocationId(saved.selectedLocationId);
      }
      if (saved.selectedSize === 'M' || saved.selectedSize === 'L') {
        setSelectedSize(saved.selectedSize);
      }
      if ([1, 3, 6, 12, 24].includes(saved.selectedHours)) {
        setSelectedHours(saved.selectedHours);
      }
      setBookingDbId(saved.bookingDbId || '');
      setRentalId(saved.rentalId || '');
      setAllocatedLocker(saved.allocatedLocker || '');
      setGuardCode(saved.guardCode || '');
      setBasePrice(saved.basePrice || 0);
      setTotalPaid(saved.totalPaid || 0);
      setRentalStartAt(saved.rentalStartAt || 0);
      setRentalEndAt(saved.rentalEndAt || 0);
      setIsDoorOpen(Boolean(saved.isDoorOpen));
      setIsLate(Boolean(saved.isLate));
      setLateAmount(saved.lateAmount || 0);
      setLatePaid(Boolean(saved.latePaid));
    }

    // Apply URL query params only when user doesn't already have an active locker
    if (!hasActive) {
      const params = new URLSearchParams(window.location.search);
      const locParam = params.get('location');
      const szParam = params.get('size') as LockerSize;
      const durParam = Number(params.get('duration'));

      if (locParam && locById(locParam)) setSelectedLocationId(locParam);
      if (szParam && (szParam === 'M' || szParam === 'L')) setSelectedSize(szParam);
      if (durParam && [1, 3, 6, 12, 24].includes(durParam)) {
        setSelectedHours(durParam);
      }
    }

    setHydrated(true);
  }, []);

  // Auto-persist session to localStorage so closing tab or returning to Beranda keeps progress
  useEffect(() => {
    if (!hydrated) return;
    if (!isLoggedIn) {
      clearBookingSession();
      return;
    }
    saveBookingSession({
      currentStep,
      phoneInput,
      isLoggedIn,
      selectedLocationId,
      selectedSize,
      selectedHours,
      bookingDbId,
      rentalId,
      allocatedLocker,
      guardCode,
      basePrice,
      totalPaid,
      rentalStartAt,
      rentalEndAt,
      isDoorOpen,
      isLate,
      lateAmount,
      latePaid,
    });
  }, [
    hydrated,
    currentStep,
    phoneInput,
    isLoggedIn,
    selectedLocationId,
    selectedSize,
    selectedHours,
    bookingDbId,
    rentalId,
    allocatedLocker,
    guardCode,
    basePrice,
    totalPaid,
    rentalStartAt,
    rentalEndAt,
    isDoorOpen,
    isLate,
    lateAmount,
    latePaid,
  ]);

  // Generate QR codes per step
  useEffect(() => {
    if (currentStep === 'pay') {
      QRCode.toDataURL(
        `00020101021126590014ID.LINKAJA.WWW01189360091800000000005204581253033605802ID5908LOCKNGO6008SURABAYA62070703A01630489F3`
      ).then(setQrPayDataUrl);
    } else if (currentStep === 'store') {
      QRCode.toDataURL(`LOCKNGO:STORE:${rentalId}:${allocatedLocker}`).then(
        setQrStoreDataUrl
      );
    } else if (currentStep === 'pickup') {
      QRCode.toDataURL(`LOCKNGO:PICKUP:${rentalId}:${guardCode}`).then(
        setQrPickupDataUrl
      );
    }
  }, [currentStep, rentalId, allocatedLocker, guardCode]);

  // Derived domain values
  const loc = locById(selectedLocationId) || CFG.locations[0];
  const canFit = canFitDuration(loc, currentTime, selectedHours);
  const blockReason = durationBlockReason(loc, currentTime, selectedHours);
  const remainingMs = rentalEndAt - currentTime;
  const isOverdue = remainingMs < 0;
  const lateInfo = lateCapped(Math.abs(remainingMs));

  // Auto-trigger simulated WhatsApp alerts when active rental nears expiry or becomes overdue
  useEffect(() => {
    if (currentStep !== 'active' || !rentalEndAt) return;

    if (remainingMs > 0 && remainingMs <= 15 * 60 * 1000 && !reminderSentRef.current) {
      reminderSentRef.current = true;
      pushNotification(
        'Pengingat 15 Menit',
        `Sisa waktu sewa loker ${allocatedLocker} di ${loc.name} kurang dari 15 menit. Perpanjang sekarang agar bebas denda.`,
        'warning',
        'WhatsApp'
      );
    }

    if (remainingMs <= 0 && !overdueSentRef.current) {
      overdueSentRef.current = true;
      pushNotification(
        'Waktu Sewa Habis',
        `Batas waktu loker ${allocatedLocker} telah lewat. Denda keterlambatan Rp5.000 per 5 menit mulai berjalan.`,
        'danger',
        'WhatsApp'
      );
    }
  }, [currentStep, rentalEndAt, remainingMs, allocatedLocker, loc.name, pushNotification]);

  const callBookingAction = useCallback(
    async (
      id: string,
      payload: Record<string, unknown>
    ): Promise<{ ok: boolean; booking?: BookingWithLocker | null; error?: string }> => {
      if (!id) return { ok: true, booking: null };
      try {
        const res = await fetch(`/api/bookings/${encodeURIComponent(id)}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const json = (await res.json()) as {
          success?: boolean;
          booking?: BookingWithLocker | null;
          error?: string;
        };
        if (!res.ok || !json.success) {
          return { ok: false, error: json.error || 'Gagal menyinkronkan ke server.' };
        }
        return { ok: true, booking: json.booking };
      } catch {
        return { ok: false, error: 'Koneksi ke server terputus. Coba lagi.' };
      }
    },
    []
  );

  // Shared helper to create booking & move to payment step
  const submitBookingToPay = useCallback(
    async (phoneValue: string) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      setActionError('');

      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phoneValue,
            locationId: selectedLocationId,
            size: selectedSize,
            durationHours: selectedHours,
          }),
        });

        const json = (await res.json()) as {
          success?: boolean;
          booking?: BookingWithLocker;
          error?: string;
        };

        if (!res.ok || !json.success || !json.booking) {
          setActionError(json.error || 'Gagal membuat pemesanan loker.');
          setCurrentStep('select');
          refreshAvailability();
          return;
        }

        const b = json.booking;
        setBookingDbId(b.id);
        setRentalId(b.booking_code);
        setBasePrice(b.base_price);
        setGuardCode(b.guard_code);
        setAllocatedLocker(b.unit_number);
        setPendingCheckout(false);
        setCurrentStep('pay');
        refreshAvailability();
      } catch {
        const price = priceOf(selectedSize, selectedHours);
        const rid = uid('LG-');
        const gCode = makeGuardCode();
        const lCode = `${selectedSize}-${pad(Math.floor(Math.random() * 4) + 1)}`;

        setBookingDbId('');
        setRentalId(rid);
        setBasePrice(price);
        setGuardCode(gCode);
        setAllocatedLocker(lCode);
        setPendingCheckout(false);
        setCurrentStep('pay');
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      selectedLocationId,
      selectedSize,
      selectedHours,
      refreshAvailability,
    ]
  );

  // Step 1/2: Login Actions
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validPhone(phoneInput)) {
      setPhoneError(
        'Nomor HP belum sesuai. Masukkan nomor aktif yang valid (mis. 81234567890).'
      );
      return;
    }
    setPhoneError('');
    setOtpError('');
    const mockOtp = makeGuardCode();
    setGeneratedOtp(mockOtp);
    setOtpInput('');
    pushNotification(
      'Kode OTP LocknGo',
      `Kode verifikasi kamu adalah ${mockOtp}. Berlaku selama 2 menit.`,
      'info',
      'WhatsApp'
    );
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedOtp || generatedOtp === '123456' || otpInput.trim() !== generatedOtp) {
      setOtpError('Kode OTP tidak cocok. Masukkan 6 digit kode yang dikirim.');
      return;
    }
    setOtpError('');
    setIsLoggedIn(true);
    setActionError('');

    // Check Supabase for any active booking tied to this phone number
    try {
      const res = await fetch(
        `/api/bookings?phone=${encodeURIComponent(phoneInput.trim())}`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const json = (await res.json()) as {
          success?: boolean;
          booking?: BookingWithLocker | null;
        };
        const active = json.booking;
        if (active) {
          setBookingDbId(active.id);
          setRentalId(active.booking_code);
          setAllocatedLocker(active.unit_number);
          setGuardCode(active.guard_code);
          setSelectedLocationId(active.location_id);
          setSelectedSize(active.size);
          setSelectedHours(active.duration_hours);
          setBasePrice(active.base_price);
          setTotalPaid(active.total_paid);
          setRentalStartAt(
            active.rental_starts_at ? new Date(active.rental_starts_at).getTime() : 0
          );
          setRentalEndAt(
            active.rental_ends_at ? new Date(active.rental_ends_at).getTime() : 0
          );
          setPickupTries(active.guard_code_failures || 0);
          setPendingCheckout(false);
          setCurrentStep(mapDbStatusToStep(active.status));
          pushNotification(
            'Sesi Loker Dipulihkan',
            `Menampilkan loker aktif ${active.unit_number} (${active.booking_code}) dari database.`,
            'info',
            'Sistem'
          );
          return;
        }
      }
    } catch {
      // Proceed to checkout or select step if lookup fails
    }

    if (pendingCheckout) {
      await submitBookingToPay(phoneInput);
      return;
    }

    setCurrentStep('select');
  };

  // Step 1: Selection Actions (If not logged in, ask OTP right before payment)
  const handleProceedToPay = async () => {
    if (isSubmitting) return;
    setActionError('');

    if (!isLoggedIn) {
      setPendingCheckout(true);
      setCurrentStep('login');
      return;
    }

    await submitBookingToPay(phoneInput);
  };

  const handleOpenLoginCheck = () => {
    setPendingCheckout(false);
    setActionError('');
    setCurrentStep('login');
  };

  const handleBackFromLogin = () => {
    setPendingCheckout(false);
    setGeneratedOtp('123456');
    setOtpInput('');
    setOtpError('');
    setCurrentStep('select');
  };

  // Cancel unpaid pending booking when going back from Payment step
  const handleBackFromPay = async () => {
    if (bookingDbId) {
      await callBookingAction(bookingDbId, { type: 'cancel' });
      setBookingDbId('');
      setRentalId('');
      setAllocatedLocker('');
      setGuardCode('');
      refreshAvailability();
    }
    setCurrentStep('select');
  };

  // Step 3: Payment Actions
  const handleSimulatePayment = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const now = Time.now();

    try {
      const res = await callBookingAction(bookingDbId, {
        type: 'pay',
        nowMs: now,
      });

      if (res.booking) {
        setTotalPaid(res.booking.total_paid);
        setRentalStartAt(
          res.booking.rental_starts_at
            ? new Date(res.booking.rental_starts_at).getTime()
            : now
        );
        setRentalEndAt(
          res.booking.rental_ends_at
            ? new Date(res.booking.rental_ends_at).getTime()
            : now + selectedHours * 3600000
        );
      } else {
        setTotalPaid(basePrice);
        setRentalStartAt(now);
        setRentalEndAt(now + selectedHours * 3600000);
      }

      reminderSentRef.current = false;
      overdueSentRef.current = false;
      setCurrentStep('store');
      setIsDoorOpen(false);
      setDoorCountdown(180);
      pushNotification(
        'Pembayaran QRIS Berhasil',
        `Sewa loker ${allocatedLocker} (${selectedHours} Jam, ${rupiah(basePrice)}) aktif. Kode Jaga: ${guardCode}.`,
        'success',
        'WhatsApp'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 4: Storage Actions
  const handleOpenStoreDoor = async () => {
    setIsDoorOpen(true);
    setDoorCountdown(180);
    await callBookingAction(bookingDbId, {
      type: 'open_store',
      nowMs: Time.now(),
    });
  };

  const handleCloseDoorAndActivate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await callBookingAction(bookingDbId, {
        type: 'activate',
        nowMs: Time.now(),
      });
      setIsDoorOpen(false);
      setCurrentStep('active');
      refreshAvailability();
      pushNotification(
        'Loker Terkunci Aman',
        `Pintu loker ${allocatedLocker} di ${loc.name} telah terkunci. Kamu akan diingatkan 15 menit sebelum waktu berakhir.`,
        'success',
        'Sistem'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 5: Active Rental Actions
  const handleExtendRental = async (extraHours: number) => {
    if (isSubmitting) return;
    setExtensionSuccess('');
    setExtensionError('');
    setIsSubmitting(true);

    try {
      const cost = extendPrice(selectedSize, extraHours);
      const res = await callBookingAction(bookingDbId, {
        type: 'extend',
        extraHours,
      });

      if (!res.ok) {
        setExtensionError(res.error || 'Gagal memperpanjang durasi.');
        return;
      }

      if (res.booking?.rental_ends_at) {
        setRentalEndAt(new Date(res.booking.rental_ends_at).getTime());
        setTotalPaid(res.booking.total_paid);
      } else {
        setRentalEndAt((e) => e + extraHours * 3600000);
        setTotalPaid((p) => p + cost);
      }

      reminderSentRef.current = false;
      overdueSentRef.current = false;
      setExtensionSuccess(`Berhasil menambah +${extraHours} Jam (${rupiah(cost)})`);
      pushNotification(
        'Perpanjangan Berhasil',
        `Waktu sewa loker ${allocatedLocker} ditambah +${extraHours} Jam (${rupiah(cost)}).`,
        'success',
        'WhatsApp'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateReminderNotif = () => {
    const lockerLabel = allocatedLocker || 'M-02';
    pushNotification(
      'Pengingat 15 Menit (Simulasi)',
      `Sisa waktu sewa loker ${lockerLabel} di ${loc.name} tinggal 15 menit. Klik perpanjang di dashboard agar bebas denda.`,
      'warning',
      'WhatsApp'
    );
  };

  const handleGoToPickup = () => {
    setIsLate(isOverdue);
    setLateAmount(isOverdue ? lateInfo.amount : 0);
    setCurrentStep('pickup');
  };

  // Step 6: Pickup Verification Actions
  const handleVerifyPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || guardLockSeconds > 0) return;

    if (!checkGuardCode(guardCode, pickupGuardInput)) {
      const tries = pickupTries + 1;
      const maxTries = CFG.rules.guardMaxTries;
      setPickupTries(tries);

      if (tries >= maxTries) {
        setGuardLockSeconds(CFG.rules.guardLockSeconds);
        setPickupGuardInput('');
        setPickupGuardError(
          `Kode jaga salah (${maxTries}/${maxTries}). Input dikunci ${CFG.rules.guardLockSeconds} detik.`
        );
      } else {
        setPickupGuardError(
          `Kode jaga salah (${tries}/${maxTries}). Cek kembali 6 digit kode di HP.`
        );
      }

      if (bookingDbId) {
        await callBookingAction(bookingDbId, {
          type: 'verify_pickup',
          method: 'code',
          guardCode: pickupGuardInput,
        });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await callBookingAction(bookingDbId, {
        type: 'verify_pickup',
        method: 'code',
        guardCode: pickupGuardInput,
      });

      if (!res.ok) {
        setPickupGuardError(res.error || 'Kode jaga salah.');
        return;
      }

      setPickupGuardError('');
      setPickupTries(0);
      setGuardLockSeconds(0);
      setIsDoorOpen(true);
      setDoorCountdown(180);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScanQrPickup = async () => {
    setPickupGuardError('');
    setIsDoorOpen(true);
    setDoorCountdown(180);
    await callBookingAction(bookingDbId, {
      type: 'verify_pickup',
      method: 'qr',
    });
  };

  const handlePayLateFee = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await callBookingAction(bookingDbId, {
        type: 'pay_late',
        lateAmount,
        nowMs: Time.now(),
      });
      if (res.booking) {
        setTotalPaid(res.booking.total_paid);
      } else {
        setTotalPaid((p) => p + lateAmount);
      }
      setLatePaid(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishRental = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await callBookingAction(bookingDbId, {
        type: 'complete',
        nowMs: Time.now(),
      });
      setIsDoorOpen(false);
      setCurrentStep('done');
      refreshAvailability();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAll = async () => {
    if (currentStep === 'pay' && bookingDbId) {
      await callBookingAction(bookingDbId, { type: 'cancel' });
    }
    clearBookingSession();
    Time.reset();
    setCurrentTime(Time.now());
    setTimeOffset(0);
    setIsLoggedIn(false);
    setPhoneInput('');
    setCurrentStep('login');
    setPendingCheckout(false);
    setSelectedLocationId('tp1');
    setSelectedSize('M');
    setSelectedHours(3);
    setAgreedTerms(false);
    setOtpInput('');
    setGeneratedOtp('123456');
    setPhoneError('');
    setOtpError('');
    setBookingDbId('');
    setRentalId('');
    setAllocatedLocker('');
    setGuardCode('');
    setBasePrice(0);
    setTotalPaid(0);
    setRentalStartAt(0);
    setRentalEndAt(0);
    setIsDoorOpen(false);
    setExtensionSuccess('');
    setExtensionError('');
    setActionError('');
    setPickupGuardInput('');
    setPickupTries(0);
    setGuardLockSeconds(0);
    setPickupGuardError('');
    setIsLate(false);
    setLateAmount(0);
    setLatePaid(false);
    setResetSignal((n) => n + 1);
    refreshAvailability();
    pushNotification(
      'Sesi Direset',
      'Semua data sesi dibersihkan dan dikembalikan ke halaman Masuk.',
      'info',
      'Sistem'
    );
  };

  const handleLogout = async () => {
    if (currentStep === 'pay' && bookingDbId) {
      await callBookingAction(bookingDbId, { type: 'cancel' });
      refreshAvailability();
    }
    clearBookingSession();
    Time.reset();
    setCurrentTime(Time.now());
    setTimeOffset(0);
    setIsLoggedIn(false);
    setPhoneInput('');
    setOtpInput('');
    setGeneratedOtp('123456');
    setPhoneError('');
    setOtpError('');
    setCurrentStep('login');
    setPendingCheckout(false);
    setBookingDbId('');
    setRentalId('');
    setAllocatedLocker('');
    setGuardCode('');
    setBasePrice(0);
    setTotalPaid(0);
    setRentalStartAt(0);
    setRentalEndAt(0);
    setIsDoorOpen(false);
    setExtensionSuccess('');
    setExtensionError('');
    setActionError('');
    setPickupGuardInput('');
    setPickupTries(0);
    setGuardLockSeconds(0);
    setPickupGuardError('');
    setIsLate(false);
    setLateAmount(0);
    setLatePaid(false);
  };

  return {
    // Step
    currentStep,
    setCurrentStep,
    // Auth
    phoneInput,
    setPhoneInput,
    otpInput,
    setOtpInput,
    generatedOtp,
    setGeneratedOtp,
    phoneError,
    otpError,
    isLoggedIn,
    // Selection
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
    // Live availability & status
    availability,
    isSubmitting,
    actionError,
    resetSignal,
    // Rental & QR
    rentalId,
    allocatedLocker,
    guardCode,
    basePrice,
    totalPaid,
    rentalStartAt,
    rentalEndAt,
    qrPayDataUrl,
    qrStoreDataUrl,
    qrPickupDataUrl,
    // Door & Clock
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
    // Pickup
    pickupGuardInput,
    setPickupGuardInput,
    pickupGuardError,
    pickupTries,
    guardLockSeconds,
    isLate,
    lateAmount,
    latePaid,
    // Actions
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
    // Notifications
    notifications,
    activeToast,
    dismissToast,
    markAllNotificationsRead,
    handleSimulateReminderNotif,
  };
}
