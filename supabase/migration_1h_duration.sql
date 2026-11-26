-- ============================================================
-- LocknGo — Migration: Izinkan durasi 1 Jam di tabel bookings
-- Jalankan di Supabase SQL Editor agar paket 1 Jam tersimpan di DB
-- ============================================================

alter table public.bookings
  drop constraint if exists bookings_duration_hours_check;

alter table public.bookings
  add constraint bookings_duration_hours_check
  check (duration_hours in (1, 3, 6, 12, 24));
