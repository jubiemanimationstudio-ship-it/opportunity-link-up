-- ============================================================
-- The Opportunity Link-up — Supabase schema (LOCKED DOWN)
-- Run this in the Supabase SQL Editor before first use.
-- All tables have RLS enabled. Only the service role key bypasses
-- RLS for admin writes. Public/anonymous keys can ONLY read
-- published rows and INSERT into the contact_messages table.
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- 1. Admin role enum
-- ============================================================
do $$ begin
  if not exists (select 1 from pg_type where typname = 'admin_role') then
    create type public.admin_role as enum ('viewer', 'editor', 'owner');
  end if;
end $$;

-- ============================================================
-- 2. Admin users table (must exist before is_admin function)
-- ============================================================
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role public.admin_role not null default 'editor',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

alter table public.admin_users enable row level security;

-- ============================================================
-- 3. Admin helper function (depends on admin_users table)
-- ============================================================
create or replace function public.is_admin(min_role public.admin_role default 'editor')
returns boolean
language sql
stable
security definer
set search_path = public
as 'select coalesce((select (case min_role when ''viewer'' then role in (''viewer'',''editor'',''owner'') when ''editor'' then role in (''editor'',''owner'') when ''owner'' then role = ''owner'' end) from public.admin_users where user_id = auth.uid() and is_active = true), false)';

-- ============================================================
-- 4. Admin users RLS policies (now is_admin exists)
-- ============================================================
drop policy if exists "admins read self" on public.admin_users;
create policy "admins read self"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin('owner'));

drop policy if exists "owners manage admins" on public.admin_users;
create policy "owners manage admins"
  on public.admin_users for all
  to authenticated
  using (public.is_admin('owner'))
  with check (public.is_admin('owner'));

-- ============================================================
-- 5. Opportunities
-- ============================================================
create table if not exists public.opportunities (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  type text not null check (type in (
    'Scholarship', 'Internship', 'Job', 'Grant',
    'Fellowship', 'Competition', 'Volunteer', 'Donation'
  )),
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image text not null default '',
  cover_image_alt text,
  organization text not null default '',
  category text not null default 'general',
  tags text[] not null default '{}',
  level text,
  funding text,
  amount text,
  duration text,
  location text,
  region text not null default 'Worldwide',
  remote boolean not null default false,
  deadline timestamptz,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reading_time_minutes integer not null default 5,
  author_name text not null default 'The Link-Up Team',
  author_role text not null default 'Editorial',
  author_avatar text,
  featured boolean not null default false,
  views integer not null default 0,
  apply_url text,
  donate_url text,
  raised_amount integer,
  goal_amount integer,
  status text not null default 'published' check (status in ('published', 'draft', 'archived')),
  created_at timestamptz not null default now()
);

create unique index if not exists idx_opportunities_slug on public.opportunities(slug);
create index if not exists idx_opportunities_status on public.opportunities(status);
create index if not exists idx_opportunities_type on public.opportunities(type);
create index if not exists idx_opportunities_published on public.opportunities(published_at desc);
create index if not exists idx_opportunities_featured on public.opportunities(featured) where featured = true;
create index if not exists idx_opportunities_deadline on public.opportunities(deadline) where status = 'published';

alter table public.opportunities enable row level security;

drop policy if exists "Public read published" on public.opportunities;
create policy "Public read published"
  on public.opportunities for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "admins read all" on public.opportunities;
create policy "admins read all"
  on public.opportunities for select
  to authenticated
  using (public.is_admin('viewer'));

drop policy if exists "admins insert" on public.opportunities;
create policy "admins insert"
  on public.opportunities for insert
  to authenticated
  with check (public.is_admin('editor'));

drop policy if exists "admins update" on public.opportunities;
create policy "admins update"
  on public.opportunities for update
  to authenticated
  using (public.is_admin('editor'))
  with check (public.is_admin('editor'));

drop policy if exists "owners delete" on public.opportunities;
create policy "owners delete"
  on public.opportunities for delete
  to authenticated
  using (public.is_admin('owner'));

-- ============================================================
-- 6. Contact messages
-- ============================================================
create table if not exists public.contact_messages (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text not null,
  type text not null default 'general',
  reason text not null default '',
  message text not null,
  user_agent text,
  ip_hash text,
  is_read boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_created on public.contact_messages(created_at desc);
create index if not exists idx_contact_unread on public.contact_messages(is_read, is_archived) where is_read = false;

alter table public.contact_messages enable row level security;

drop policy if exists "anon insert contact" on public.contact_messages;
create policy "anon insert contact"
  on public.contact_messages for insert
  to anon, authenticated
  with check (
    length(name) between 1 and 120
    and length(email) between 3 and 200
    and position('@' in email) > 1
    and length(message) between 1 and 5000
  );

drop policy if exists "admins read contact" on public.contact_messages;
create policy "admins read contact"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin('viewer'));

drop policy if exists "admins update contact" on public.contact_messages;
create policy "admins update contact"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin('editor'))
  with check (public.is_admin('editor'));

drop policy if exists "owners delete contact" on public.contact_messages;
create policy "owners delete contact"
  on public.contact_messages for delete
  to authenticated
  using (public.is_admin('owner'));

-- ============================================================
-- 7. Newsletter subscribers
-- ============================================================
create table if not exists public.newsletter_subscribers (
  id text primary key default gen_random_uuid()::text,
  email text not null unique,
  source text not null default 'homepage',
  is_confirmed boolean not null default false,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_newsletter_created on public.newsletter_subscribers(created_at desc);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "anon insert newsletter" on public.newsletter_subscribers;
create policy "anon insert newsletter"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (
    length(email) between 3 and 200
    and position('@' in email) > 1
  );

drop policy if exists "admins read newsletter" on public.newsletter_subscribers;
create policy "admins read newsletter"
  on public.newsletter_subscribers for select
  to authenticated
  using (public.is_admin('viewer'));

-- ============================================================
-- 8. Analytics events (high-volume, admin only)
-- ============================================================
create table if not exists public.analytics_events (
  id bigserial primary key,
  kind text not null,
  visitor_id text,
  opportunity_id text,
  country text,
  referrer text,
  meta jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_kind on public.analytics_events(kind, created_at desc);
create index if not exists idx_analytics_visitor on public.analytics_events(visitor_id);
create index if not exists idx_analytics_opp on public.analytics_events(opportunity_id, created_at desc);

alter table public.analytics_events enable row level security;

drop policy if exists "anon insert analytics" on public.analytics_events;
create policy "anon insert analytics"
  on public.analytics_events for insert
  to anon, authenticated
  with check (length(kind) between 1 and 40);

drop policy if exists "admins read analytics" on public.analytics_events;
create policy "admins read analytics"
  on public.analytics_events for select
  to authenticated
  using (public.is_admin('viewer'));

-- ============================================================
-- 9. Audit log (admin only, append-only)
-- ============================================================
create table if not exists public.audit_log (
  id bigserial primary key,
  actor_id uuid,
  actor_email text,
  action text not null,
  target text,
  meta jsonb,
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_created on public.audit_log(created_at desc);
create index if not exists idx_audit_actor on public.audit_log(actor_id, created_at desc);

alter table public.audit_log enable row level security;

drop policy if exists "admins read audit" on public.audit_log;
create policy "admins read audit"
  on public.audit_log for select
  to authenticated
  using (public.is_admin('viewer'));

drop policy if exists "admins insert audit" on public.audit_log;
create policy "admins insert audit"
  on public.audit_log for insert
  to authenticated
  with check (public.is_admin('viewer'));

-- No update or delete policies on audit_log — append-only.

-- ============================================================
-- 10. Updated-at trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as 'begin new.updated_at = now(); return new; end;';

drop trigger if exists trg_opportunities_updated_at on public.opportunities;
create trigger trg_opportunities_updated_at
  before update on public.opportunities
  for each row execute function public.set_updated_at();

-- ============================================================
-- 11. Grant minimal schema access to anon/authenticated
-- ============================================================
revoke all on schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;

-- Read-only on opportunities to anon
grant select (id, slug, type, title, excerpt, cover_image, cover_image_alt, organization,
              category, tags, level, funding, amount, duration, location, region, remote,
              deadline, published_at, reading_time_minutes, author_name, author_role,
              author_avatar, featured, views, apply_url, donate_url, raised_amount,
              goal_amount, status, created_at)
  on public.opportunities to anon, authenticated;

-- Insert to contact_messages and newsletter
grant insert on public.contact_messages to anon, authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;
grant insert on public.analytics_events to anon, authenticated;

-- Service role (used by Next.js with SUPABASE_SERVICE_ROLE_KEY) bypasses RLS
-- and gets full CRUD. NEVER expose the service role key to the client.

-- ============================================================
-- 12. Helper: how to create the first admin
-- ============================================================
-- 1) Sign up the admin user via Supabase Auth (email + password).
-- 2) Run this SQL, replacing the UUID and email:
--      insert into public.admin_users (user_id, email, role)
--      values ('00000000-0000-0000-0000-000000000000', 'admin@opportunitylinkup.com', 'owner');
-- 3) Sign in via /admin/login (then we wire Supabase Auth below).
-- For the current env-password flow, the service role key is used server-side only.
