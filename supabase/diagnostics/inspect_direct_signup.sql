-- =============================================================================
-- Post-deploy inspector for public.direct_signup
--
-- Read-only. Run in the Supabase SQL Editor when you need to confirm what is
-- actually deployed, or when a signup fails and you need the real error.
--
-- This file intentionally asserts nothing about any particular bug: the
-- 42703 "email_change_token" failure it originally diagnosed was fixed by
-- 20261004_fix_direct_signup_columns.sql, and a stale expected-output comment
-- would mislead the next person debugging a new failure.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- QUERY 1
-- The deployed function body. Confirm the INSERT column list matches the
-- columns that actually exist (QUERY 2) — Postgres reports only the FIRST
-- error per statement, so a single bad column name can hide a second problem
-- such as a missing NOT NULL column with no default.
-- -----------------------------------------------------------------------------
SELECT pg_get_functiondef(p.oid) AS direct_signup_definition
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname = 'direct_signup';


-- -----------------------------------------------------------------------------
-- QUERY 2
-- Columns that actually exist on auth.users. Compare against the INSERT list in
-- QUERY 1; any name present there but absent here is undefined_column (42703).
-- -----------------------------------------------------------------------------
SELECT
  ordinal_position,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'auth'
  AND table_name = 'users'
ORDER BY ordinal_position;


-- -----------------------------------------------------------------------------
-- QUERY 3
-- Row-level security on public.teams. Signup inserts through a SECURITY
-- DEFINER function and so bypasses RLS; every other read and write must be
-- constrained to auth.uid() = user_id or a team captain could see or edit
-- another team's profile and pitch deck.
-- Expected: rls_enabled = true for every result.
-- -----------------------------------------------------------------------------
SELECT
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'teams';

SELECT relrowsecurity AS rls_enabled
FROM pg_class
WHERE oid = 'public.teams'::regclass;


-- -----------------------------------------------------------------------------
-- QUERY 4
-- Accounts that were pre-confirmed without email ownership proof, which is the
-- documented accepted risk of the direct_signup design. Useful for auditing
-- before registration opens.
-- -----------------------------------------------------------------------------
SELECT
  email,
  created_at,
  (SELECT count(*) FROM public.teams t WHERE t.user_id = u.id) AS team_rows
FROM auth.users u
ORDER BY created_at DESC
LIMIT 50;


-- -----------------------------------------------------------------------------
-- QUERY 5
-- Duplicate emails differing only by case. These are the rows the previous
-- case-sensitive guard let through, and GoTrue will resolve them arbitrarily at
-- sign-in. Expected: zero rows once the lower(btrim(...)) fix is deployed.
-- -----------------------------------------------------------------------------
SELECT lower(email) AS normalized, count(*) AS rows_with_this_email
FROM auth.users
GROUP BY lower(email)
HAVING count(*) > 1;


-- -----------------------------------------------------------------------------
-- QUERY 6
-- Orphaned auth.users rows with no teams row. These block re-registration
-- because the duplicate guard rejects any existing address.
-- -----------------------------------------------------------------------------
SELECT u.email, u.email_confirmed_at, u.created_at
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.teams t WHERE t.user_id = u.id)
ORDER BY u.created_at DESC
LIMIT 50;


-- =============================================================================
-- PITCH DECK STORAGE
-- =============================================================================

-- -----------------------------------------------------------------------------
-- QUERY 7
-- Bucket state. `public = false` means decks are private and are only reachable
-- through signed URLs; the client falls back to the stored public URL when
-- signing is unavailable, so a public bucket also works.
-- Also confirms the file_size_limit matches MAX_FILE_SIZE_MB in Profile.tsx (50 MB).
-- Expected: exactly one row, id = 'pitch-decks'.
-- -----------------------------------------------------------------------------
SELECT id, name, public, file_size_limit, created_at
FROM storage.buckets
WHERE id = 'pitch-decks';


-- -----------------------------------------------------------------------------
-- QUERY 8
-- Storage RLS policies. Without these scoped to the caller's own folder,
-- uploads fail with 400/403 even though the bucket exists.
-- Expected: four policies, all restricted to bucket_id = 'pitch-decks' and
--           (storage.foldername(name))[1] = auth.uid()::text
-- -----------------------------------------------------------------------------
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%pitch deck%'
ORDER BY policyname;


-- -----------------------------------------------------------------------------
-- QUERY 9
-- Orphaned pitch deck files. uploadPitchDeck now removes the previous file
-- after a successful upload, so each team should have at most one object.
-- More than one row per user means uploads happened before that fix.
-- -----------------------------------------------------------------------------
SELECT
  (storage.foldername(name))[1] AS user_id,
  count(*)                  AS objects_stored,
  max(created_at)           AS newest
FROM storage.objects
WHERE bucket_id = 'pitch-decks'
GROUP BY (storage.foldername(name))[1]
HAVING count(*) > 1
ORDER BY objects_stored DESC;


-- -----------------------------------------------------------------------------
-- QUERY 10
-- Rows whose stored deck URL points at a file that no longer exists in storage.
-- A non-empty result means the database and storage disagree, which is what the
-- "Could not generate a link to your file" message in the UI indicates.
-- -----------------------------------------------------------------------------
SELECT t.user_id, t.pitch_deck_filename, t.pitch_deck_url
FROM public.teams t
WHERE t.pitch_deck_url IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM storage.objects o
    WHERE o.bucket_id = 'pitch-decks'
      AND o.name LIKE t.user_id::text || '/%'
  );


-- =============================================================================
-- DIAGNOSING: "The file uploaded, but saving its reference failed."
--
-- The real Postgres error code is in the browser console, on the line
-- starting "[auth] Unhandled error". Match it against the three checks
-- below.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- QUERY 11
-- Are the two columns present? Empty result here means the upsert fails
-- with 42703 undefined_column for pitch_deck_url / pitch_deck_filename.
-- Expected: two rows.
-- -----------------------------------------------------------------------------
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'teams'
  AND column_name IN ('pitch_deck_url', 'pitch_deck_filename')
ORDER BY column_name;


-- -----------------------------------------------------------------------------
-- QUERY 12
-- Is there a unique index on user_id? Empty result here means the upsert
-- fails with 42P10: there is no unique or exclusion constraint matching
-- the ON CONFLICT specification.
-- Expected: at least one row.
-- -----------------------------------------------------------------------------
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'teams'
  AND indexdef LIKE '%user_id%';


-- -----------------------------------------------------------------------------
-- QUERY 13
-- Do policies permit the update? Empty result here means RLS is enabled
-- with no matching policy and the upsert fails with 42501.
-- Expected: SELECT, INSERT and UPDATE policies for auth.uid() = user_id.
-- -----------------------------------------------------------------------------
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'teams'
ORDER BY cmd, policyname;


-- -----------------------------------------------------------------------------
-- QUERY 14
-- Full live schema of public.teams, with nullability and defaults.
--
-- Any row where is_nullable = 'NO' AND column_default IS NULL is a
-- column that MUST be present in every INSERT. The client's profile
-- update only sends the fields being changed, so a required column
-- with no default that is left out makes the statement fail with
-- 23502 not_null_violation.
--
-- Expected: every NOT NULL column either has a default or is one the
-- client always supplies (user_id, team_name).
-- -----------------------------------------------------------------------------
SELECT
  ordinal_position,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'teams'
ORDER BY ordinal_position;