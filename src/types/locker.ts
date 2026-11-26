export type LockerSize = 'M' | 'L';

export interface LockerSizeConfig {
  code: LockerSize;
  name: string;
  dims: string;
  litre: number;
  fits: string;
  short: string;
}

export type LocationCategory = 'mall' | 'stasiun' | 'stadion';

export interface LocationConfig {
  id: string;
  name: string;
  category: LocationCategory;
  categoryLabel: string;
  area: string;
  units: {
    M: number;
    L: number;
  };
  openAt: number; // minutes from 00:00
  closesAt: number; // minutes from 00:00
  alwaysOpen: boolean;
  open: string;
}

export interface BookingState {
  id: string;
  bookingCode: string;
  phone: string;
  locationId: string;
  size: LockerSize;
  durationHours: number;
  basePrice: number;
  extensionPrice: number;
  lateFee: number;
  totalPaid: number;
  status: 'pending_payment' | 'paid' | 'stored' | 'active' | 'completed' | 'cancelled';
  lockerCode: string;
  guardCode: string;
  qrToken?: string;
  qrExpiresAt?: string;
  startedAt?: string;
  expiresAt?: string;
  actualPickupAt?: string;
  createdAt: string;
}
