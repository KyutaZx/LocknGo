import { CFG } from './data';
import { LockerSize, LocationConfig } from '@/types/locker';

/* ---------- Formatting & Utilities ---------- */
export const rupiah = (n: number): string =>
  'Rp' + Math.round(n).toLocaleString('id-ID');

export const pad = (n: number | string): string =>
  String(n).padStart(2, '0');

export const uid = (prefix = 'LG-'): string =>
  prefix + Math.random().toString(36).slice(2, 9).toUpperCase();

export const clamp = (n: number, a: number, b: number): number =>
  Math.min(b, Math.max(a, n));

export function fmtDur(ms: number): string {
  const t = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function fmtClock(ts: number | Date): string {
  const d = new Date(ts);
  return `${pad(d.getHours())}.${pad(d.getMinutes())}`;
}

export function fmtDate(ts: number | Date): string {
  const d = new Date(ts);
  const b = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${b[d.getMonth()]} ${d.getFullYear()}`;
}

export function fmtDateTime(ts: number | Date): string {
  return `${fmtDate(ts)}, ${fmtClock(ts)}`;
}

export function sameDay(a: number | Date, b: number | Date): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

/* ---------- Virtual Clock (D-09) ---------- */
export class VirtualClock {
  private offset = 0;

  now(): number {
    return Date.now() + this.offset;
  }

  getOffset(): number {
    return this.offset;
  }

  advance(ms: number): void {
    this.offset += ms;
  }

  reset(): void {
    this.offset = 0;
  }

  setClock(hours: number, minutes: number): void {
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    this.offset = d.getTime() - Date.now();
  }
}

export const Time = new VirtualClock();

/* ---------- Guard Code (D-07) ---------- */
export function makeGuardCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function checkGuardCode(real: string | number, input: string | number): boolean {
  return String(input).replace(/\D/g, '') === String(real).replace(/\D/g, '');
}

/* ---------- Pricing Engine ---------- */
export function priceOf(size: LockerSize, hours: number): number {
  return CFG.price[size]?.[hours] || 0;
}

export function extendPrice(size: LockerSize, hours: number): number {
  return CFG.extend[hours]?.[size] || 0;
}

/* ---------- Late Fees Engine (D-02) ---------- */
export interface LateFeeResult {
  minutes: number;
  blocks: number;
  amount: number;
  atCap?: boolean;
  overCap?: boolean;
}

export function lateCalc(overdueMs: number): LateFeeResult {
  if (overdueMs <= 0) return { minutes: 0, blocks: 0, amount: 0 };
  const minutes = Math.ceil(overdueMs / 60000);
  const blocks = Math.ceil(minutes / CFG.late.blockMinutes);
  return { minutes, blocks, amount: blocks * CFG.late.perBlock };
}

export function lateCapped(overdueMs: number): LateFeeResult {
  const L = CFG.late;
  const day = 86400000;
  const raw = lateCalc(overdueMs);
  const capped = Math.min(Math.max(overdueMs, 0), L.capHours * 3600000);
  const fullDays = Math.floor(capped / day);
  const rem = lateCalc(capped - fullDays * day);
  const amount = fullDays * L.maxPerDay + Math.min(L.maxPerDay, rem.amount);
  return {
    minutes: raw.minutes,
    blocks: raw.blocks,
    amount,
    atCap: raw.amount > amount,
    overCap: overdueMs > L.capHours * 3600000,
  };
}

/* ---------- Location & Operational Hours (D-03) ---------- */
export function locById(id: string): LocationConfig | undefined {
  return CFG.locations.find((l) => l.id === id);
}

export function minutesOfDay(ts: number | Date): number {
  const d = new Date(ts);
  return d.getHours() * 60 + d.getMinutes();
}

export function closeTs(loc: LocationConfig, ts: number | Date): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime() + loc.closesAt * 60000;
}

export function isOpenNow(loc: LocationConfig, ts: number | Date): boolean {
  if (loc.alwaysOpen) return true;
  const m = minutesOfDay(ts);
  return m >= loc.openAt && m < loc.closesAt;
}

export function canFitDuration(loc: LocationConfig, startTs: number, hours: number): boolean {
  if (loc.alwaysOpen) return true;
  return startTs + hours * 3600000 <= closeTs(loc, startTs);
}

export function hoursLeftToClose(loc: LocationConfig, ts: number): number {
  if (loc.alwaysOpen) return Infinity;
  return Math.max(0, (closeTs(loc, ts) - ts) / 3600000);
}

export function durationBlockReason(
  loc: LocationConfig,
  startTs: number,
  hours: number
): string | null {
  if (canFitDuration(loc, startTs, hours)) return null;
  const leftMin = Math.max(0, Math.round((closeTs(loc, startTs) - startTs) / 60000));
  const left = leftMin >= 60 ? Math.floor(leftMin / 60) + ' jam' : leftMin + ' menit';
  const tutup = fmtClock(closeTs(loc, startTs));
  const fits = (CFG.durations as readonly number[]).filter((h) => canFitDuration(loc, startTs, h));
  const maxH = fits.length ? Math.max(...fits) : 0;
  const alt = CFG.locations.find((l) => l.alwaysOpen)?.name || 'Stasiun Gubeng';
  return maxH > 0
    ? `Tutup pukul ${tutup}. Pilih durasi maksimal ${maxH} jam, atau gunakan ${alt} (akses 24 jam).`
    : `Tutup pukul ${tutup} (sisa ${left}). Gunakan ${alt} (akses 24 jam).`;
}

/* Extension check */
export function canExtendRental(
  loc: LocationConfig,
  currentEndAt: number,
  startAt: number,
  additionalHours: number
): boolean {
  if (loc.alwaysOpen) return true;
  return currentEndAt + additionalHours * 3600000 <= closeTs(loc, startAt);
}

/* ---------- Phone Validation ---------- */
export function normPhone(v: string): string {
  const raw = String(v).trim();
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  // Non-Indonesian international number explicitly prefixed with '+'
  if (raw.startsWith('+') && !digits.startsWith('62')) {
    return '+' + digits;
  }

  let d = digits;
  if (d.startsWith('62')) {
    d = '0' + d.slice(2).replace(/^0+/, '');
  } else if (d.startsWith('8')) {
    d = '0' + d;
  }
  return d;
}

export function validPhone(v: string): boolean {
  const normalized = normPhone(v);
  if (!normalized) return false;

  if (normalized.startsWith('+')) {
    const digits = normalized.slice(1);
    return digits.length >= 8 && digits.length <= 15;
  }

  return (
    normalized.length >= 10 &&
    normalized.length <= 14 &&
    normalized.startsWith('08')
  );
}

export function prettyPhone(v: string): string {
  const normalized = normPhone(v);
  if (normalized.startsWith('+')) {
    return normalized.replace(/^(\+\d{2})(\d{3,4})(\d+)/, '$1 $2-$3');
  }
  return normalized.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
}
