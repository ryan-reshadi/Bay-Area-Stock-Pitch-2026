-- Restrict pitch deck access and harden exposed database routines.
-- Existing objects and rows are retained; only access controls change.

-- The bucket is private in the original migration, but ON CONFLICT DO NOTHING
-- preserved the live public setting. Make the intended private mode explicit and
-- enforce the same 50 MB limit used by the upload form.
UPDATE storage.buckets
SET public = false,
    file_size_limit = 52428800
WHERE id = 'pitch-decks';

-- This legacy RPC is not called by the application and accepts an arbitrary
-- user_id. Keep its definition for rollback compatibility, but make it
-- unavailable through the Data API.
REVOKE EXECUTE ON FUNCTION public.create_team_profile(uuid, text, text, text, text)
  FROM PUBLIC, anon, authenticated;
ALTER FUNCTION public.create_team_profile(uuid, text, text, text, text)
  SET search_path = pg_catalog, public, auth, extensions, pg_temp;

-- Registration must work before a session exists. Grant it only to anon rather
-- than PUBLIC/authenticated, and pin the existing safe resolution order.
REVOKE EXECUTE ON FUNCTION public.direct_signup(text, text, text, text, text, text)
  FROM PUBLIC, authenticated;
GRANT EXECUTE ON FUNCTION public.direct_signup(text, text, text, text, text, text)
  TO anon;
ALTER FUNCTION public.direct_signup(text, text, text, text, text, text)
  SET search_path = pg_catalog, extensions, auth, public, pg_temp;

-- Pin the trigger function path as well; its body uses only built-in functions
-- and the row supplied by the trigger.
ALTER FUNCTION public.handle_teams_updated()
  SET search_path = pg_catalog, public;

-- Match the same ownership rules while evaluating auth.uid() once per statement
-- instead of once per row. Drop both historical policy names so this migration
-- works against the checked-in schema and the live project.
DROP POLICY IF EXISTS "Users can view own team" ON public.teams;
DROP POLICY IF EXISTS "Users can view their own team" ON public.teams;
DROP POLICY IF EXISTS "Users can insert own team" ON public.teams;
DROP POLICY IF EXISTS "Users can create their own team" ON public.teams;
DROP POLICY IF EXISTS "Users can update own team" ON public.teams;
DROP POLICY IF EXISTS "Users can update their own team" ON public.teams;
DROP POLICY IF EXISTS "Users can delete their own team" ON public.teams;

CREATE POLICY "Users can view own team"
  ON public.teams FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert own team"
  ON public.teams FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update own team"
  ON public.teams FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can delete own team"
  ON public.teams FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);
