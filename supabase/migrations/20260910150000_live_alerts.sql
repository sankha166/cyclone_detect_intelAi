alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists location_latitude double precision,
  add column if not exists location_longitude double precision,
  add column if not exists location_updated_at timestamptz,
  add column if not exists notification_preferences jsonb not null default '{"severe_cyclone": true, "landfall": true, "email": false}'::jsonb;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('cyclone_alert', 'system', 'report')),
  severity text not null default 'info' check (severity in ('safe', 'moderate', 'danger', 'critical', 'info')),
  title text not null,
  message text not null,
  cyclone_id uuid references public.cyclones(id) on delete set null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);
alter table public.notifications enable row level security;
drop policy if exists "Users can read their notifications" on public.notifications;
drop policy if exists "Users can update their notifications" on public.notifications;
create policy "Users can read their notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update their notifications" on public.notifications for update using (auth.uid() = user_id);

create or replace view public.live_cyclone_positions as
select distinct on (coalesce(storm_id, id::text))
  id, coalesce(storm_id, id::text) as storm_id, latitude, longitude,
  wind_speed_kt, pressure_hpa, cyclone_probability, created_at, result
from public.analysis_runs
where status = 'completed' and cyclone_detected = true
  and latitude is not null and longitude is not null
order by coalesce(storm_id, id::text), created_at desc;

grant select on public.live_cyclone_positions to anon, authenticated;
