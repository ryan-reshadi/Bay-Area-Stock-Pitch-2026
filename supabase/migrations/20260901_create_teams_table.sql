-- =============================================================================
-- Create public.teams — RECONSTRUCTED
--
-- WHY THIS FILE EXISTS
--
-- `supabase/migrations/` contained no schema files when this change set was
-- authored: the migration that created public.teams was missing from the
-- repository. That made the database unreproducible — a fresh environment, a
-- `supabase db reset`, or CI could not build a working schema, and
-- direct_signup referenced a table that did not exist there.
--
-- !! VERIFY BEFORE RELYING ON IT !!
--
-- This definition is reconstructed from the application's own contract, the
-- TeamProfile interface in src/lib/types.ts, plus the access pattern in
-- src/lib/team.ts. It has NOT been diffed against the live table, because the
-- original migration was lost.
--
-- It is written with CREATE TABLE IF NOT EXISTS and CREATE POLICY IF NOT EXISTS
-- so that applying it to the existing production database is a NO-OP and
-- cannot alter existing data. The live table remains authoritative.
--
-- To confirm this matches reality, run in the SQL Editor:
--   SELECT column_name, data_type, is_nullable
--   FROM information_schema.columns
--   WHERE table_schema = 'public' AND table_name = 'teams'
--   ORDER BY ordinal_position;
--
-- Required by:
--   - direct_signup inserts a teams row in the signup transaction
--   - getTeamProfile selects by user_id and uses maybeSingle(), so user_id
--     must be unique
--   - upsertTeamProfile uses onConflict: 'user_id', so a UNIQUE constraint on
--     user_id is required for the upsert to work at all
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.teams (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL UNIQUE
                        REFERENCES auth.users (id) ON DELETE CASCADE,
  team_name           text NOT NULL,
  member1_name        text,
  member2_name        text,
  member3_name        text,
  pitch_deck_url      text,
  pitch_deck_filename text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Serve the "my team profile" lookup by user_id.
CREATE INDEX IF NOT EXISTS teams_user_id_idx ON public.teams (user_id);

-- Row Level Security: a team captain can only ever reach their own row.
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own team" ON public.teams;
CREATE POLICY "Users can view own team"
  ON public.teams
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own team" ON public.teams;
CREATE POLICY "Users can insert own team"
  ON public.teams
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own team" ON public.teams;
CREATE POLICY "Users can update own team"
  ON public.teams
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Deletion is intentionally not granted to the client. Teams are removed by the
-- auth.users ON DELETE CASCADE, and by the SECURITY DEFINER direct_signup
-- rollback path.
--
-- NOTE: direct_signup runs as SECURITY DEFINER, so it bypasses RLS when
-- inserting the teams row for a brand-new user who has no session yet. That is
-- why signup can insert at all.