-- ============================================================
-- LocknGo — Seed Data (7 Lokasi & Unit Loker Surabaya)
-- ============================================================

-- 1. Insert Locations
insert into public.locations (id, name, category, category_label, area, open_at, closes_at, always_open, open_hours_label)
values
  ('tp1', 'Tunjungan Plaza 1', 'mall', 'Mall', 'Lantai Ground, dekat eskalator utama', 600, 1320, false, '10.00 – 22.00'),
  ('glx', 'Galaxy Mall 3', 'mall', 'Mall', 'Lantai 1, dekat pintu masuk timur', 600, 1320, false, '10.00 – 22.00'),
  ('pvr', 'Pakuwon Mall', 'mall', 'Mall', 'Lantai UG, dekat food court', 600, 1320, false, '10.00 – 22.00'),
  ('gub', 'Stasiun Gubeng', 'stasiun', 'Stasiun', 'Hall utama, akses 24 jam', 0, 1440, true, '24 jam'),
  ('pst', 'Stasiun Pasar Turi', 'stasiun', 'Stasiun', 'Pintu Timur, dekat loket tiket', 0, 1440, true, '24 jam'),
  ('gbt', 'Stadion Gelora Bung Tomo', 'stadion', 'Stadion', 'Concourse Barat, samping Gate 7', 420, 1380, false, '07.00 – 23.00'),
  ('g10', 'Stadion Gelora 10 November', 'stadion', 'Stadion', 'Lobi Barat Tambaksari, dekat ticket box', 480, 1320, false, '08.00 – 22.00')
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  category_label = excluded.category_label,
  area = excluded.area,
  open_at = excluded.open_at,
  closes_at = excluded.closes_at,
  always_open = excluded.always_open,
  open_hours_label = excluded.open_hours_label;

-- 2. Insert Lockers for Each Location (Units M and L, with 1 reserve unit per size)
-- Helper function to generate lockers
do $$
declare
  loc record;
  m_count int;
  l_count int;
  i int;
begin
  for loc in select id from public.locations loop
    -- Default units per location (from data.js)
    if loc.id = 'tp1' then m_count := 5; l_count := 4;
    elsif loc.id = 'glx' then m_count := 4; l_count := 3;
    elsif loc.id = 'pvr' then m_count := 5; l_count := 4;
    elsif loc.id = 'gub' then m_count := 4; l_count := 4;
    elsif loc.id = 'pst' then m_count := 4; l_count := 3;
    elsif loc.id = 'gbt' then m_count := 6; l_count := 4;
    elsif loc.id = 'g10' then m_count := 4; l_count := 3;
    else m_count := 4; l_count := 3;
    end if;

    -- Generate M units (last unit is reserve)
    for i in 1..m_count loop
      insert into public.lockers (location_id, unit_number, size, is_reserve, status)
      values (loc.id, 'M-' || lpad(i::text, 2, '0'), 'M', (i = m_count), 'ready')
      on conflict (location_id, unit_number) do nothing;
    end loop;

    -- Generate L units (last unit is reserve)
    for i in 1..l_count loop
      insert into public.lockers (location_id, unit_number, size, is_reserve, status)
      values (loc.id, 'L-' || lpad(i::text, 2, '0'), 'L', (i = l_count), 'ready')
      on conflict (location_id, unit_number) do nothing;
    end loop;
  end loop;
end $$;
