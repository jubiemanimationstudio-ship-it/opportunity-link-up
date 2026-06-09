-- ============================================================
-- The Opportunity Link-up — CLEAN Supabase schema
-- ============================================================
-- Run this ONCE in the Supabase SQL Editor.
-- It drops and recreates the 3 tables the app actually uses.
-- ============================================================

-- ========================================
-- 1. opportunities — all posts
-- ========================================
DROP TABLE IF EXISTS public.opportunities CASCADE;

CREATE TABLE public.opportunities (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  type text NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image text NOT NULL DEFAULT '',
  cover_image_alt text,
  organization text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  tags text[] NOT NULL DEFAULT '{}',
  level text,
  funding text,
  amount text,
  duration text,
  location text,
  region text NOT NULL DEFAULT 'Global',
  remote boolean NOT NULL DEFAULT false,
  deadline timestamptz,
  published_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  reading_time_minutes integer NOT NULL DEFAULT 5,
  author_name text NOT NULL DEFAULT 'The Link-Up Team',
  author_role text NOT NULL DEFAULT 'Editorial',
  author_avatar text,
  featured boolean NOT NULL DEFAULT false,
  views integer NOT NULL DEFAULT 0,
  apply_url text,
  donate_url text,
  raised_amount integer,
  goal_amount integer,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON public.opportunities FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_opp_slug ON public.opportunities (slug);
CREATE INDEX IF NOT EXISTS idx_opp_status ON public.opportunities (status);
CREATE INDEX IF NOT EXISTS idx_opp_type ON public.opportunities (type);
CREATE INDEX IF NOT EXISTS idx_opp_published ON public.opportunities (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_opp_featured ON public.opportunities (featured) WHERE featured = true;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS
'BEGIN NEW.updated_at = now(); RETURN NEW; END;';

DROP TRIGGER IF EXISTS trg_opp_updated ON public.opportunities;
CREATE TRIGGER trg_opp_updated
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ========================================
-- 2. analytics_events — page views, clicks, etc.
-- ========================================
DROP TABLE IF EXISTS public.analytics_events CASCADE;

CREATE TABLE public.analytics_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  kind text NOT NULL,
  visitor_id text,
  country text,
  referrer text,
  opportunity text,
  slug text,
  opp_type text,
  email text,
  name text,
  reason text,
  channel text,
  amount numeric,
  query text,
  results integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON public.analytics_events FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_ae_created_at ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ae_kind ON public.analytics_events (kind);
CREATE INDEX IF NOT EXISTS idx_ae_slug ON public.analytics_events (slug);
CREATE INDEX IF NOT EXISTS idx_ae_visitor ON public.analytics_events (visitor_id);

-- ========================================
-- 3. admin_config — password hash, recovery, settings
-- ========================================
DROP TABLE IF EXISTS public.admin_config CASCADE;

CREATE TABLE public.admin_config (
  id text PRIMARY KEY DEFAULT 'main',
  password_hash text NOT NULL DEFAULT '',
  recovery_passphrase_hash text NOT NULL DEFAULT '',
  password_hint text NOT NULL DEFAULT '',
  admin_email text NOT NULL DEFAULT '',
  password_set_at bigint NOT NULL DEFAULT 0,
  last_password_change_at bigint NOT NULL DEFAULT 0,
  failed_recovery_attempts integer NOT NULL DEFAULT 0,
  locked_until bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON public.admin_config FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ========================================
-- 4. audit_log — admin actions (persisted)
-- ========================================
DROP TABLE IF EXISTS public.audit_log CASCADE;

CREATE TABLE public.audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  action text NOT NULL,
  ip text,
  target text,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON public.audit_log FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_log (action);

-- ========================================
-- Done. 4 tables total.
-- ========================================
