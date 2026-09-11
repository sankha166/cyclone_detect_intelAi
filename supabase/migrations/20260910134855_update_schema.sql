-- Run in Supabase SQL Editor. Auth users are managed by Supabase Auth.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  organization text not null default '',
  role text not null default 'analyst' check (role in ('analyst', 'operator', 'admin')),
  avatar_url text,
  location_latitude double precision,
  location_longitude double precision,
  location_updated_at timestamptz,
  notification_preferences jsonb not null default '{"severe_cyclone": true, "landfall": true, "email": false}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_path text,
  request_date date not null,
  request_time time not null,
  status text not null default 'completed' check (status in ('queued', 'processing', 'completed', 'failed')),
  cyclone_detected boolean,
  cyclone_probability numeric(6,5),
  storm_id text,
  latitude double precision,
  longitude double precision,
  wind_speed_kt double precision,
  pressure_hpa double precision,
  processing_time_ms integer,
  accuracy numeric(6,5),
  result jsonb not null default '{}'::jsonb,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.forecast_points (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analysis_runs(id) on delete cascade,
  lead_hours integer not null check (lead_hours >= 0),
  valid_at timestamptz,
  latitude double precision not null,
  longitude double precision not null,
  wind_speed_kt double precision,
  pressure_hpa double precision,
  confidence numeric(6,5),
  created_at timestamptz not null default now(),
  unique (analysis_id, lead_hours)
);

create table if not exists public.cyclones (
  id uuid primary key default gen_random_uuid(),
  storm_id text unique not null,
  name text,
  basin text,
  season integer,
  status text not null default 'historical',
  source text,
  track jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_id uuid references public.analysis_runs(id) on delete set null,
  title text not null,
  format text not null default 'json' check (format in ('json', 'pdf', 'csv')),
  file_path text,
  created_at timestamptz not null default now()
);

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

create index if not exists analysis_runs_user_created_idx on public.analysis_runs(user_id, created_at desc);
create index if not exists forecast_points_analysis_idx on public.forecast_points(analysis_id, lead_hours);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);

alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists location_latitude double precision,
  add column if not exists location_longitude double precision,
  add column if not exists location_updated_at timestamptz,
  add column if not exists notification_preferences jsonb not null default '{"severe_cyclone": true, "landfall": true, "email": false}'::jsonb;

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

-- The table may already exist on remote projects created from an earlier schema.
-- CREATE TABLE IF NOT EXISTS does not add columns to an existing table.
alter table public.analysis_runs
  add column if not exists processing_time_ms integer,
  add column if not exists accuracy numeric(6,5);

create or replace view public.dashboard_metrics as
select
  count(*)::integer as total_predictions,
  count(*) filter (where cyclone_detected = true)::integer as cyclones_detected,
  round((avg(accuracy) * 100)::numeric, 2)::double precision as average_accuracy,
  round((avg(processing_time_ms) / 1000.0)::numeric, 2)::double precision as average_processing_time
from public.analysis_runs
where status = 'completed';

grant select on public.dashboard_metrics to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.analysis_runs enable row level security;
alter table public.forecast_points enable row level security;
alter table public.cyclones enable row level security;
alter table public.reports enable row level security;

drop policy if exists "Users can read their profile" on public.profiles;
drop policy if exists "Users can update their profile" on public.profiles;
drop policy if exists "Users can read their analyses" on public.analysis_runs;
drop policy if exists "Users can create analyses" on public.analysis_runs;
drop policy if exists "Users can update their analyses" on public.analysis_runs;
drop policy if exists "Users can delete their analyses" on public.analysis_runs;
drop policy if exists "Users can read forecast points for their analyses" on public.forecast_points;
drop policy if exists "Users can create forecast points for their analyses" on public.forecast_points;
drop policy if exists "Anyone can read cyclone archive" on public.cyclones;
drop policy if exists "Users can read their reports" on public.reports;
drop policy if exists "Users can create reports" on public.reports;
create policy "Users can read their profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can read their analyses" on public.analysis_runs for select using (auth.uid() = user_id);
create policy "Users can create analyses" on public.analysis_runs for insert with check (auth.uid() = user_id);
create policy "Users can update their analyses" on public.analysis_runs for update using (auth.uid() = user_id);
create policy "Users can delete their analyses" on public.analysis_runs for delete using (auth.uid() = user_id);
create policy "Users can read forecast points for their analyses" on public.forecast_points for select using (exists (select 1 from public.analysis_runs a where a.id = analysis_id and a.user_id = auth.uid()));
create policy "Users can create forecast points for their analyses" on public.forecast_points for insert with check (exists (select 1 from public.analysis_runs a where a.id = analysis_id and a.user_id = auth.uid()));
create policy "Anyone can read cyclone archive" on public.cyclones for select using (true);
create policy "Users can read their reports" on public.reports for select using (auth.uid() = user_id);
create policy "Users can create reports" on public.reports for insert with check (auth.uid() = user_id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, organization)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), coalesce(new.raw_user_meta_data->>'organization', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into storage.buckets (id, name, public) values ('satellite-images', 'satellite-images', false) on conflict (id) do nothing;
drop policy if exists "Users can upload satellite images" on storage.objects;
drop policy if exists "Users can read satellite images" on storage.objects;
create policy "Users can upload satellite images" on storage.objects for insert to authenticated with check (bucket_id = 'satellite-images' and (storage.foldername(name))[1] = (select auth.uid()::text));
create policy "Users can read satellite images" on storage.objects for select to authenticated using (bucket_id = 'satellite-images' and (storage.foldername(name))[1] = (select auth.uid()::text));
