-- Analytics events table for persistent tracking
-- Run this in Supabase SQL Editor

create table if not exists public.analytics_events (
  id uuid default gen_random_uuid() primary key,
  kind text not null,
  visitor_id text,
  country text,
  referrer text,
  opportunity text,
  email text,
  name text,
  reason text,
  channel text,
  amount numeric,
  query text,
  results integer,
  created_at timestamptz not null default now()
);

-- RLS: only service role can read/write
alter table public.analytics_events enable row level security;

create policy "Service role only" on public.analytics_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Index for dashboard queries
create index if not exists idx_analytics_events_created_at on public.analytics_events (created_at desc);
create index if not exists idx_analytics_events_kind on public.analytics_events (kind);
