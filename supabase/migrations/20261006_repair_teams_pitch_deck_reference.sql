-- =============================================================================
-- Repair public.teams so a pitch deck reference can be saved
--
-- SYMPTOM
--   "The file uploaded, but saving its reference failed."
--   Storage succeeds, the teams upsert fails.
--
-- ROOT CAUSE CANDIDATES
--   All three are failures of the upsert, and all three are silent
--   under the old code because team.ts discarded the error and
--   returned null, so the caller reported success. That means a pitch
--   deck could be stored in storage yet never recorded on the team —
--   which is exactly why the profile showed no attached file.
--
--   1. 42703 undefined_column
--      The teams table lacks pitch_deck_url / pitch_deck_filename.
--      Those columns came from a migration that was lost from the repo,
--      so they exist only on the live table. A fresh or rebuilt
--      database would not have them.
--
--   2. 42P10 no unique constraint matching ON CONFLICT
--      upsertTeamProfile uses { onConflict: 'user_id' }. Postgres
--      refuses that unless user_id has a UNIQUE constraint or index.
--      The original table definition may have omitted it.
--
--   3. 42501 insufficient_privilege
--      Row Level Security is enabled but no policy allows the update.
--
-- This migration is deliberately additive and idempotent: every
-- statement is IF NOT EXISTS, so it is a no-op wherever the object
-- already exists and cannot alter or delete existing data.
-- =============================================================================

-- 1. Ensure the two columns the client writes actually exist.
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS pitch_deck_url text;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS pitch_deck_filename text;

-- 2. ON CONFLICT (user_id) is already legal: the live table has
--    teams_user_id_key, a unique index on user_id (confirmed by
--    diagnostics Query 12). On a fresh database, 20260901 declares
--    user_id UNIQUE, which creates the same index. No action needed
--    here, and adding a second unique index would be redundant.

-- 3. Re-assert RLS policies so an authenticated captain can update
--    only their own row. Postgres has no CREATE POLICY IF NOT EXISTS,
--    so these are dropped and recreated.
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own team" ON public.teams;
CREATE POLICY "Users can view own team"
  ON public.teams FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own team" ON public.teams;
CREATE POLICY "Users can insert own team"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own team" ON public.teams;
CREATE POLICY "Users can update own team"
  ON public.teams FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);