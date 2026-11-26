import { LockerSize } from '@/types/locker';

export const LOCKNGO_SESSION_KEY = 'lockngo_session_v1';

export interface PersistedBookingSession {
  currentStep: 'login' | 'select' | 'pay' | 'store' | 'active' | 'pickup' | 'done';
  phoneInput: string;
  isLoggedIn: boolean;
  selectedLocationId: string;
  selectedSize: LockerSize;
  selectedHours: number;
  bookingDbId?: string;
  rentalId: string;
  allocatedLocker: string;
  guardCode: string;
  basePrice: number;
  totalPaid: number;
  rentalStartAt: number;
  rentalEndAt: number;
  isDoorOpen: boolean;
  isLate: boolean;
  lateAmount: number;
  latePaid: boolean;
}

export function loadBookingSession(): PersistedBookingSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(LOCKNGO_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedBookingSession;
  } catch {
    return null;
  }
}

export function saveBookingSession(session: PersistedBookingSession): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOCKNGO_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Storage quota or private mode unavailable
  }
}

export function clearBookingSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(LOCKNGO_SESSION_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function hasActiveLockerSession(session: PersistedBookingSession | null): boolean {
  if (!session || !session.isLoggedIn || !session.allocatedLocker) return false;
  return (
    session.currentStep === 'store' ||
    session.currentStep === 'active' ||
    session.currentStep === 'pickup'
  );
}
