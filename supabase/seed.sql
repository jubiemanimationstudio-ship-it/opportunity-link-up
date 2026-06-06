-- ============================================================
-- The Opportunity Link-up — Starter seed (2 examples)
--
-- This file shows the format for inserting opportunities.
-- The full set of sample data is bundled in the app code as
-- a fallback. Use the admin panel to add more, or extend this
-- file with additional INSERT statements following the same
-- pattern.
--
-- Run this AFTER schema.sql in the Supabase SQL Editor.
-- ============================================================

insert into public.opportunities (
  id, slug, type, title, excerpt, content,
  cover_image, cover_image_alt, organization, category,
  tags, level, funding, amount, duration, location, region, remote,
  deadline, published_at, reading_time_minutes,
  author_name, author_role, featured, views,
  apply_url, status
) values
(
  'sch-001',
  'chevening-scholarship-2026',
  'Scholarship',
  'Chevening Scholarship 2026: Full Application Guide',
  'The UK government''s flagship scholarship is open. Fully funded one-year master''s at any UK university for emerging African leaders.',
  '<p class="lead">Chevening is the UK government''s international scholarships programme funded by the Foreign, Commonwealth and Development Office. It sponsors future leaders from over 160 countries for a fully-funded one-year master''s in the UK.</p><h2>Who is Chevening for?</h2><p>Chevening is built for emerging leaders with at least two years of work experience, an undergraduate degree, and a clear plan to return home and contribute.</p><h2>What''s covered</h2><p>Full tuition fees, monthly living stipend, return economy flights, arrival allowance, departure allowance, thesis grant where applicable, and travel costs for the Chevening events programme.</p><h2>Eligibility</h2><p>Citizen of a Chevening-eligible country, undergraduate degree meeting UK 2:1 standard, at least 2,800 hours of work experience, apply to three different eligible UK master''s courses, commit to returning to your home country for two years after the programme.</p><h2>Timeline</h2><p>Applications typically open in August and close in early November. Shortlisted candidates are interviewed at British High Commissions between February and April. Offers issued in June, arrival in September.</p>',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80&auto=format&fit=crop',
  'Graduates throwing caps in the air',
  'UK Government — FCDO',
  'Masters',
  array['UK', 'Fully Funded', 'Leadership', 'Government'],
  'Masters',
  'Fully Funded',
  'Full tuition + £1,500/mo stipend',
  '1 year',
  'United Kingdom',
  'Europe',
  false,
  (now() + interval '38 days'),
  (now() - interval '2 days'),
  9,
  'Link-Up Editorial',
  'Opportunity Desk',
  true,
  4821,
  'https://www.chevening.org/scholarship/',
  'published'
),
(
  'int-001',
  'google-step-internship-2026',
  'Internship',
  'Google STEP Internship 2026 — First & Second-Year Students',
  'Paid 12-week summer internship for first and second-year undergraduate students in Computer Science or related fields.',
  '<p class="lead">Google''s Student Training in Engineering Program (STEP) is a paid 12-week summer internship designed for first and second-year undergraduate students with a passion for computer science.</p><h2>What you''ll do</h2><p>Work on a real software project with a Google engineering team. Past projects have shipped to billions of users.</p><h2>Eligibility</h2><p>Currently enrolled in a Bachelor''s degree in Computer Science, Software Engineering, or a related technical field. Must be in first or second year of study.</p><h2>Locations</h2><p>Bangalore, London, Munich, Zurich, Tel Aviv, Accra, and other Google offices. Remote-friendly options vary by team.</p><h2>Compensation</h2><p>Highly competitive hourly rate, housing stipend for interns who relocate, travel reimbursement, and free meals on-site.</p>',
  'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1600&q=80&auto=format&fit=crop',
  'Software engineers collaborating at a whiteboard',
  'Google',
  'Internship',
  array['Tech', 'Engineering', 'Summer', 'Paid'],
  'Undergraduate',
  'Salaried',
  'USD 7,500–11,000/month',
  '12 weeks',
  'Multiple global locations',
  'Worldwide',
  true,
  (now() + interval '21 days'),
  (now() - interval '1 days'),
  4,
  'Link-Up Editorial',
  'Opportunity Desk',
  true,
  9120,
  'https://buildyourfuture.withgoogle.com/programs/step',
  'published'
)
on conflict (id) do nothing;
