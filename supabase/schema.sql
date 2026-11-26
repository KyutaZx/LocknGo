-- ============================================================
-- LocknGo — Database Schema (Supabase / PostgreSQL)
-- Venture Creation Kelompok 3
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- 1. Locations
create table if not exists public.locations (
  id text primary key,
  name text not null,
  category text not null check (category in ('mall', 'stasiun', 'stadion')),
  category_label text not null,
  area text not null,
  open_at int not null,           -- Menit dari 00.00 (e.g. 600 = 10.00)
  closes_at int not null,         -- Menit dari 00.00 (e.g. 1320 = 22.00)
  always_open boolean default false,
  open_hours_label text not null,
  created_at timestamptz default now()
);

-- 2. Physical Lockers
create table if not exists public.lockers (
  id uuid primary key default gen_random_uuid(),
  location_id text not null references public.locations(id) on delete cascade,
  unit_number text not null,      -- 'M-01', 'L-01'
  size text not null check (size in ('M', 'L')),
  is_reserve boolean default false, -- 1 unit cadangan per ukuran
  status text not null default 'ready' check (status in ('ready', 'reserved', 'occupied', 'maintenance')),
  updated_at timestamptz default now(),
  unique (location_id, unit_number)
);

-- 3. Bookings
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text unique not null,
  user_phone text not null,
  location_id text not null references public.locations(id),
  locker_id uuid references public.lockers(id),
  size text not null check (size in ('M', 'L')),
  duration_hours int not null check (duration_hours in (1, 3, 6, 12, 24)),
  status text not null default 'pending_payment' check (
    status in ('pending_payment', 'paid_unclaimed', 'active', 'completed', 'late', 'secured')
  ),
  base_price numeric not null,
  extend_price numeric not null default 0,
  late_fee numeric not null default 0,
  total_paid numeric not null default 0,
  qr_deposit_token text unique,
  qr_pickup_token text unique,
  qr_pickup_expires_at timestamptz,
  guard_code varchar(6) not null,
  guard_code_failures int not null default 0,
  deposit_started_at timestamptz,
  rental_starts_at timestamptz,
  rental_ends_at timestamptz,
  completed_at timestamptz,
  reopen_grace_used boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  payment_type text not null check (payment_type in ('initial_booking', 'extend', 'late_penalty')),
  amount numeric not null,
  qris_reference text,
  qris_string text,
  status text not null default 'pending' check (status in ('pending', 'settlement', 'expired', 'failed')),
  settled_at timestamptz,
  created_at timestamptz default now()
);

-- 5. Activity Logs (Audit Trail)
create table if not exists public.activity_logs (
  id bigserial primary key,
  booking_id uuid references public.bookings(id) on delete cascade,
  event_type text not null,
  description text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Indices for performance
create index if not exists idx_lockers_location on public.lockers(location_id, size, status);
create index if not exists idx_bookings_user_phone on public.bookings(user_phone);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_tokens on public.bookings(qr_deposit_token, qr_pickup_token, guard_code);
create index if not exists idx_payments_booking on public.payments(booking_id);

-- Enable Realtime for Lockers & Bookings
alter publication supabase_realtime add table public.lockers;
alter publication supabase_realtime add table public.bookings;

-- Row Level Security (RLS)
alter table public.locations enable row level security;
alter table public.lockers enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.activity_logs enable row level security;

-- Public Read Policies
create policy "Locations are viewable by everyone" on public.locations for select using (true);
create policy "Lockers are viewable by everyone" on public.lockers for select using (true);
create policy "Public can view own bookings via phone or id" on public.bookings for select using (true);
create policy "Public can insert bookings" on public.bookings for insert with check (true);
create policy "Public can update own bookings" on public.bookings for update using (true);
create policy "Payments are viewable by booking owner" on public.payments for select using (true);
create policy "Public can create payments" on public.payments for insert with check (true);
create policy "Public can update payments" on public.payments for update using (true);
create policy "Logs viewable" on public.activity_logs for select using (true);
create policy "Logs insertable" on public.activity_logs for insert with check (true);
