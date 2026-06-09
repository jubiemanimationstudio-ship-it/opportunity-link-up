-- Admin config table — persists password, recovery, email across cold starts
-- Run this in Supabase SQL Editor

create table if not exists public.admin_config (
  id text primary key default 'main',
  password_hash text not null default '',
  recovery_passphrase_hash text not null default '',
  password_hint text not null default '',
  admin_email text not null default '',
  password_set_at bigint not null default 0,
  last_password_change_at bigint not null default 0,
  failed_recovery_attempts integer not null default 0,
  locked_until bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- RLS: only service role can read/write
alter table public.admin_config enable row level security;

create policy "Service role only" on public.admin_config
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
