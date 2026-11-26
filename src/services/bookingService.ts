import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase/admin';
import { CFG } from '@/lib/data';
import {
  priceOf,
  extendPrice,
  makeGuardCode,
  uid,
  validPhone,
  normPhone,
  locById,
  checkGuardCode,
} from '@/lib/engine';
import { LockerSize } from '@/types/locker';
import { BookingStatus, Database } from '@/types/database';

type BookingRow = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type LockerRow = Database['public']['Tables']['lockers']['Row'];

export interface SizeAvailability {
  ready: number;
  total: number;
}

export type LocationAvailabilityMap = Record<
  string,
  Record<LockerSize, SizeAvailability>
>;

export interface BookingWithLocker {
  id: string;
  booking_code: string;
  user_phone: string;
  location_id: string;
  locker_id: string | null;
  unit_number: string;
  size: LockerSize;
  duration_hours: number;
  status: BookingStatus;
  base_price: number;
  extend_price: number;
  late_fee: number;
  total_paid: number;
  guard_code: string;
  guard_code_failures: number;
  deposit_started_at: string | null;
  rental_starts_at: string | null;
  rental_ends_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface CreateBookingInput {
  phone: string;
  locationId: string;
  size: LockerSize;
  durationHours: number;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
  persistence?: 'supabase' | 'demo';
}

export type BookingActionPayload =
  | { type: 'pay'; nowMs?: number }
  | { type: 'open_store'; nowMs?: number }
  | { type: 'activate'; nowMs?: number }
  | { type: 'extend'; extraHours: number }
  | { type: 'pay_late'; lateAmount: number; nowMs?: number }
  | { type: 'verify_pickup'; method: 'qr' | 'code'; guardCode?: string }
  | { type: 'complete'; nowMs?: number }
  | { type: 'cancel' };

function buildFallbackAvailability(): LocationAvailabilityMap {
  const map: LocationAvailabilityMap = {};
  for (const loc of CFG.locations) {
    const mTotal = Math.max(0, loc.units.M - CFG.rules.reserveUnits);
    const lTotal = Math.max(0, loc.units.L - CFG.rules.reserveUnits);
    map[loc.id] = {
      M: { ready: mTotal, total: mTotal },
      L: { ready: lTotal, total: lTotal },
    };
  }
  return map;
}

function toBookingWithLocker(
  row: BookingRow,
  unitNumber: string
): BookingWithLocker {
  return {
    id: row.id,
    booking_code: row.booking_code,
    user_phone: row.user_phone,
    location_id: row.location_id,
    locker_id: row.locker_id,
    unit_number: unitNumber,
    size: row.size,
    duration_hours: row.duration_hours,
    status: row.status,
    base_price: Number(row.base_price),
    extend_price: Number(row.extend_price),
    late_fee: Number(row.late_fee),
    total_paid: Number(row.total_paid),
    guard_code: row.guard_code,
    guard_code_failures: row.guard_code_failures,
    deposit_started_at: row.deposit_started_at,
    rental_starts_at: row.rental_starts_at,
    rental_ends_at: row.rental_ends_at,
    completed_at: row.completed_at,
    created_at: row.created_at,
  };
}

async function logActivity(
  bookingId: string,
  eventType: string,
  description: string,
  metadata: Record<string, string | number | boolean | null> = {}
): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from('activity_logs').insert({
      booking_id: bookingId,
      event_type: eventType,
      description,
      metadata,
    });
  } catch {
    // Non-blocking audit log write
  }
}

/**
 * Fetch live locker availability across all locations.
 * Respects the business rule of keeping 1 reserve unit per size (`is_reserve = false`).
 */
export async function getAvailability(): Promise<
  ServiceResult<LocationAvailabilityMap>
> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: buildFallbackAvailability(),
      statusCode: 200,
      persistence: 'demo',
    };
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('lockers')
      .select('location_id, size, is_reserve, status');

    if (error || !data) {
      return {
        success: true,
        data: buildFallbackAvailability(),
        statusCode: 200,
        persistence: 'demo',
      };
    }

    const map: LocationAvailabilityMap = {};
    for (const loc of CFG.locations) {
      map[loc.id] = {
        M: { ready: 0, total: 0 },
        L: { ready: 0, total: 0 },
      };
    }

    for (const locker of data) {
      if (locker.is_reserve) continue;
      if (!map[locker.location_id]) {
        map[locker.location_id] = {
          M: { ready: 0, total: 0 },
          L: { ready: 0, total: 0 },
        };
      }
      const bucket = map[locker.location_id][locker.size];
      bucket.total += 1;
      if (locker.status === 'ready') {
        bucket.ready += 1;
      }
    }

    return {
      success: true,
      data: map,
      statusCode: 200,
      persistence: 'supabase',
    };
  } catch {
    return {
      success: true,
      data: buildFallbackAvailability(),
      statusCode: 200,
      persistence: 'demo',
    };
  }
}

/**
 * Restore the latest active (non-completed) booking for a given phone number.
 */
export async function getActiveBookingByPhone(
  phone: string
): Promise<ServiceResult<BookingWithLocker | null>> {
  if (!validPhone(phone)) {
    return {
      success: false,
      error: 'Format nomor HP tidak valid.',
      statusCode: 400,
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: null,
      statusCode: 200,
      persistence: 'demo',
    };
  }

  try {
    const supabase = createAdminClient();
    const normalizedPhone = normPhone(phone);

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_phone', normalizedPhone)
      .in('status', ['pending_payment', 'paid_unclaimed', 'active', 'late'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !booking) {
      return {
        success: true,
        data: null,
        statusCode: 200,
        persistence: 'supabase',
      };
    }

    let unitNumber = `${booking.size}-01`;
    if (booking.locker_id) {
      const { data: locker } = await supabase
        .from('lockers')
        .select('unit_number')
        .eq('id', booking.locker_id)
        .maybeSingle();
      if (locker?.unit_number) {
        unitNumber = locker.unit_number;
      }
    }

    return {
      success: true,
      data: toBookingWithLocker(booking, unitNumber),
      statusCode: 200,
      persistence: 'supabase',
    };
  } catch {
    return {
      success: true,
      data: null,
      statusCode: 200,
      persistence: 'demo',
    };
  }
}

/**
 * Atomically claim one ready non-reserve locker using optimistic concurrency control.
 */
async function claimReadyLocker(
  locationId: string,
  size: LockerSize
): Promise<LockerRow | null> {
  const supabase = createAdminClient();
  const { data: candidates, error } = await supabase
    .from('lockers')
    .select('*')
    .eq('location_id', locationId)
    .eq('size', size)
    .eq('is_reserve', false)
    .eq('status', 'ready')
    .order('unit_number', { ascending: true });

  if (error || !candidates || candidates.length === 0) {
    return null;
  }

  for (const candidate of candidates) {
    const { data: claimed, error: updateError } = await supabase
      .from('lockers')
      .update({
        status: 'reserved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidate.id)
      .eq('status', 'ready')
      .select('*')
      .maybeSingle();

    if (!updateError && claimed) {
      return claimed;
    }
  }

  return null;
}

/**
 * Create a new smart locker booking, atomically reserving a real locker unit in Supabase.
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<ServiceResult<BookingWithLocker>> {
  const { phone, locationId, size, durationHours } = input;

  if (!phone || !locationId || !size || !durationHours) {
    return {
      success: false,
      error: 'Data pemesanan tidak lengkap.',
      statusCode: 400,
    };
  }

  if (size !== 'M' && size !== 'L') {
    return {
      success: false,
      error: 'Ukuran loker tidak valid. Pilih M atau L.',
      statusCode: 400,
    };
  }

  if (!validPhone(phone)) {
    return {
      success: false,
      error: 'Format nomor HP tidak valid.',
      statusCode: 400,
    };
  }

  const location = locById(locationId);
  if (!location) {
    return {
      success: false,
      error: 'Lokasi loker tidak ditemukan.',
      statusCode: 404,
    };
  }

  const normalizedPhone = normPhone(phone);
  const hours = Number(durationHours);
  const basePrice = priceOf(size, hours);

  if (basePrice <= 0) {
    return {
      success: false,
      error: 'Durasi paket sewa tidak valid.',
      statusCode: 400,
    };
  }

  const guardCode = makeGuardCode();
  const bookingCode = uid('LG-');

  if (!isSupabaseConfigured()) {
    const fallbackUnit = `${size}-01`;
    return {
      success: true,
      data: {
        id: bookingCode,
        booking_code: bookingCode,
        user_phone: normalizedPhone,
        location_id: locationId,
        locker_id: null,
        unit_number: fallbackUnit,
        size,
        duration_hours: hours,
        status: 'pending_payment',
        base_price: basePrice,
        extend_price: 0,
        late_fee: 0,
        total_paid: 0,
        guard_code: guardCode,
        guard_code_failures: 0,
        deposit_started_at: null,
        rental_starts_at: null,
        rental_ends_at: null,
        completed_at: null,
        created_at: new Date().toISOString(),
      },
      statusCode: 201,
      persistence: 'demo',
    };
  }

  const supabase = createAdminClient();
  const claimedLocker = await claimReadyLocker(locationId, size);

  if (!claimedLocker) {
    return {
      success: false,
      error: `Semua loker ukuran ${size} di ${location.name} sedang terpakai. Coba ukuran atau lokasi lain.`,
      statusCode: 409,
    };
  }

  const payload: BookingInsert = {
    booking_code: bookingCode,
    user_phone: normalizedPhone,
    location_id: locationId,
    locker_id: claimedLocker.id,
    size,
    duration_hours: hours,
    status: 'pending_payment',
    base_price: basePrice,
    extend_price: 0,
    late_fee: 0,
    total_paid: 0,
    qr_deposit_token: `LOCKNGO:STORE:${bookingCode}:${claimedLocker.unit_number}`,
    qr_pickup_token: `LOCKNGO:PICKUP:${bookingCode}:${guardCode}`,
    guard_code: guardCode,
  };

  const { data: booking, error: insertError } = await supabase
    .from('bookings')
    .insert(payload)
    .select('*')
    .single();

  if (insertError || !booking) {
    // Roll back locker reservation so unit is never stuck
    await supabase
      .from('lockers')
      .update({ status: 'ready', updated_at: new Date().toISOString() })
      .eq('id', claimedLocker.id)
      .eq('status', 'reserved');

    const msg = insertError?.message || 'Gagal menyimpan pemesanan ke database.';
    if (msg.includes('bookings_duration_hours_check')) {
      return {
        success: false,
        error:
          'Durasi 1 Jam belum diaktifkan di database Supabase. Jalankan supabase/migration_1h_duration.sql di SQL Editor, atau pilih 3/6/12/24 Jam.',
        statusCode: 400,
      };
    }

    return {
      success: false,
      error: msg,
      statusCode: 500,
    };
  }

  await supabase.from('payments').insert({
    booking_id: booking.id,
    payment_type: 'initial_booking',
    amount: basePrice,
    qris_reference: `QRIS-${bookingCode}`,
    qris_string:
      '00020101021126590014ID.LINKAJA.WWW01189360091800000000005204581253033605802ID5908LOCKNGO6008SURABAYA62070703A01630489F3',
    status: 'pending',
  });

  await logActivity(
    booking.id,
    'booking_created',
    `Pemesanan ${bookingCode} dibuat untuk unit ${claimedLocker.unit_number} (${hours} Jam).`,
    {
      location_id: locationId,
      unit_number: claimedLocker.unit_number,
      size,
      duration_hours: hours,
      base_price: basePrice,
    }
  );

  return {
    success: true,
    data: toBookingWithLocker(booking, claimedLocker.unit_number),
    statusCode: 201,
    persistence: 'supabase',
  };
}

/**
 * Execute a booking lifecycle transition against Supabase.
 */
export async function performBookingAction(
  bookingId: string,
  action: BookingActionPayload
): Promise<ServiceResult<BookingWithLocker | null>> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      data: null,
      statusCode: 200,
      persistence: 'demo',
    };
  }

  const supabase = createAdminClient();
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .maybeSingle();

  if (fetchError || !booking) {
    return {
      success: false,
      error: 'Data booking tidak ditemukan.',
      statusCode: 404,
    };
  }

  let unitNumber = `${booking.size}-01`;
  if (booking.locker_id) {
    const { data: locker } = await supabase
      .from('lockers')
      .select('unit_number')
      .eq('id', booking.locker_id)
      .maybeSingle();
    if (locker?.unit_number) unitNumber = locker.unit_number;
  }

  const nowIso = new Date().toISOString();

  if (action.type === 'cancel') {
    if (booking.status !== 'pending_payment') {
      return {
        success: false,
        error: 'Hanya pemesanan yang belum dibayar yang dapat dibatalkan.',
        statusCode: 400,
      };
    }

    if (booking.locker_id) {
      await supabase
        .from('lockers')
        .update({ status: 'ready', updated_at: nowIso })
        .eq('id', booking.locker_id)
        .eq('status', 'reserved');
    }

    await supabase.from('bookings').delete().eq('id', booking.id);

    return {
      success: true,
      data: null,
      statusCode: 200,
      persistence: 'supabase',
    };
  }

  if (action.type === 'pay') {
    const startMs = action.nowMs ?? Date.now();
    const startIso = new Date(startMs).toISOString();
    const endIso = new Date(startMs + booking.duration_hours * 3600000).toISOString();
    const amount = Number(booking.base_price);

    const { data: updated, error } = await supabase
      .from('bookings')
      .update({
        status: 'paid_unclaimed',
        total_paid: amount,
        rental_starts_at: startIso,
        rental_ends_at: endIso,
        updated_at: nowIso,
      })
      .eq('id', booking.id)
      .select('*')
      .single();

    if (error || !updated) {
      return {
        success: false,
        error: 'Gagal memperbarui status pembayaran.',
        statusCode: 500,
      };
    }

    await supabase
      .from('payments')
      .update({ status: 'settlement', settled_at: nowIso })
      .eq('booking_id', booking.id)
      .eq('payment_type', 'initial_booking');

    await logActivity(
      booking.id,
      'payment_settled',
      `Pembayaran QRIS ${booking.booking_code} lunas (${amount}).`,
      { amount, unit_number: unitNumber }
    );

    return {
      success: true,
      data: toBookingWithLocker(updated, unitNumber),
      statusCode: 200,
      persistence: 'supabase',
    };
  }

  if (action.type === 'open_store') {
    const depositIso = new Date(action.nowMs ?? Date.now()).toISOString();
    const { data: updated, error } = await supabase
      .from('bookings')
      .update({
        deposit_started_at: depositIso,
        updated_at: nowIso,
      })
      .eq('id', booking.id)
      .select('*')
      .single();

    if (error || !updated) {
      return {
        success: false,
        error: 'Gagal mencatat pembukaan pintu simpan.',
        statusCode: 500,
      };
    }

    await logActivity(
      booking.id,
      'store_door_opened',
      `Pintu loker ${unitNumber} dibuka untuk memasukkan barang.`,
      { unit_number: unitNumber }
    );

    return {
      success: true,
      data: toBookingWithLocker(updated, unitNumber),
      statusCode: 200,
      persistence: 'supabase',
    };
  }

  if (action.type === 'activate') {
    const { data: updated, error } = await supabase
      .from('bookings')
      .update({
        status: 'active',
        updated_at: nowIso,
      })
      .eq('id', booking.id)
      .select('*')
      .single();

    if (error || !updated) {
      return {
        success: false,
        error: 'Gagal mengaktifkan status sewa loker.',
        statusCode: 500,
      };
    }

    if (booking.locker_id) {
      await supabase
        .from('lockers')
        .update({ status: 'occupied', updated_at: nowIso })
        .eq('id', booking.locker_id);
    }

    await logActivity(
      booking.id,
      'locker_activated',
      `Pintu loker ${unitNumber} terkunci dan sewa aktif.`,
      { unit_number: unitNumber }
    );

    return {
      success: true,
      data: toBookingWithLocker(updated, unitNumber),
      statusCode: 200,
      persistence: 'supabase',
    };
  }

  if (action.type === 'extend') {
    const extraHours = Number(action.extraHours);
    const cost = extendPrice(booking.size, extraHours);
    if (cost <= 0) {
      return {
        success: false,
        error: 'Pilihan perpanjangan waktu tidak valid.',
        statusCode: 400,
      };
    }

    const currentEndMs = booking.rental_ends_at
      ? new Date(booking.rental_ends_at).getTime()
      : Date.now();
    const newEndIso = new Date(currentEndMs + extraHours * 3600000).toISOString();
    const newExtendPrice = Number(booking.extend_price) + cost;
    const newTotalPaid = Number(booking.total_paid) + cost;

    const { data: updated, error } = await supabase
      .from('bookings')
      .update({
        extend_price: newExtendPrice,
        total_paid: newTotalPaid,
        rental_ends_at: newEndIso,
        updated_at: nowIso,
      })
      .eq('id', booking.id)
      .select('*')
      .single();

    if (error || !updated) {
      return {
        success: false,
        error: 'Gagal menyimpan perpanjangan waktu sewa.',
        statusCode: 500,
      };
    }

    await supabase.from('payments').insert({
      booking_id: booking.id,
      payment_type: 'extend',
      amount: cost,
      qris_reference: `EXT-${booking.booking_code}-${Date.now()}`,
      status: 'settlement',
      settled_at: nowIso,
    });

    await logActivity(
      booking.id,
      'rental_extended',
      `Durasi loker ${unitNumber} diperpanjang +${extraHours} Jam (${cost}).`,
      { extra_hours: extraHours, cost, unit_number: unitNumber }
    );

    return {
      success: true,
      data: toBookingWithLocker(updated, unitNumber),
      statusCode: 200,
      persistence: 'supabase',
    };
  }

  if (action.type === 'pay_late') {
    const lateAmount = Math.max(0, Number(action.lateAmount));
    const newLateFee = Number(booking.late_fee) + lateAmount;
    const newTotalPaid = Number(booking.total_paid) + lateAmount;

    const { data: updated, error } = await supabase
      .from('bookings')
      .update({
        status: 'late',
        late_fee: newLateFee,
        total_paid: newTotalPaid,
        updated_at: nowIso,
      })
      .eq('id', booking.id)
      .select('*')
      .single();

    if (error || !updated) {
      return {
        success: false,
        error: 'Gagal memproses pembayaran denda.',
        statusCode: 500,
      };
    }

    await supabase.from('payments').insert({
      booking_id: booking.id,
      payment_type: 'late_penalty',
      amount: lateAmount,
      qris_reference: `LATE-${booking.booking_code}-${Date.now()}`,
      status: 'settlement',
      settled_at: nowIso,
    });

    await logActivity(
      booking.id,
      'late_fee_paid',
      `Denda keterlambatan loker ${unitNumber} lunas (${lateAmount}).`,
      { late_amount: lateAmount, unit_number: unitNumber }
    );

    return {
      success: true,
      data: toBookingWithLocker(updated, unitNumber),
      statusCode: 200,
      persistence: 'supabase',
    };
  }

  if (action.type === 'verify_pickup') {
    if (action.method === 'code') {
      if (!checkGuardCode(booking.guard_code, action.guardCode || '')) {
        const nextFailures = booking.guard_code_failures + 1;
        await supabase
          .from('bookings')
          .update({
            guard_code_failures: nextFailures,
            updated_at: nowIso,
          })
          .eq('id', booking.id);

        await logActivity(
          booking.id,
          'pickup_guard_code_failed',
          `Percobaan kode jaga salah (${nextFailures}/3) untuk loker ${unitNumber}.`,
          { failures: nextFailures, unit_number: unitNumber }
        );

        return {
          success: false,
          error: `Kode jaga salah (${nextFailures}/3).`,
          statusCode: 400,
        };
      }
    }

    await logActivity(
      booking.id,
      'pickup_door_opened',
      `Pintu loker ${unitNumber} dibuka untuk pengambilan via ${action.method === 'qr' ? 'QR' : 'Kode Jaga'}.`,
      { method: action.method, unit_number: unitNumber }
    );

    return {
      success: true,
      data: toBookingWithLocker(booking, unitNumber),
      statusCode: 200,
      persistence: 'supabase',
    };
  }

  if (action.type === 'complete') {
    const completedIso = new Date(action.nowMs ?? Date.now()).toISOString();
    const { data: updated, error } = await supabase
      .from('bookings')
      .update({
        status: 'completed',
        completed_at: completedIso,
        updated_at: nowIso,
      })
      .eq('id', booking.id)
      .select('*')
      .single();

    if (error || !updated) {
      return {
        success: false,
        error: 'Gagal menyelesaikan sesi sewa.',
        statusCode: 500,
      };
    }

    if (booking.locker_id) {
      await supabase
        .from('lockers')
        .update({ status: 'ready', updated_at: nowIso })
        .eq('id', booking.locker_id);
    }

    await logActivity(
      booking.id,
      'rental_completed',
      `Sewa loker ${unitNumber} selesai dan unit kembali tersedia.`,
      { unit_number: unitNumber, total_paid: Number(updated.total_paid) }
    );

    return {
      success: true,
      data: toBookingWithLocker(updated, unitNumber),
      statusCode: 200,
      persistence: 'supabase',
    };
  }

  return {
    success: false,
    error: 'Aksi booking tidak dikenali.',
    statusCode: 400,
  };
}
