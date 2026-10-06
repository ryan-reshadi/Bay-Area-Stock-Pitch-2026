-- =============================================================================
-- Create the pitch-decks storage bucket and its per-user RLS policies.
--
-- WHY THIS FILE EXISTS
--
-- There was no storage migration anywhere in the repository. The `pitch-decks`
-- bucket and its policies were presumably created by hand in the dashboard, so
-- a fresh environment had no bucket at all and every upload failed. Because the
-- failure was previously swallowed (team.ts returned null and the caller
-- discarded it), the app reported a successful upload that never happened.
--
-- The bucket is created PRIVATE. Pitch decks are competition submissions and
-- should not be world-readable to anyone who guesses a URL. The client reads
-- them through short-lived signed URLs instead of getPublicUrl; see
-- createPitchDeckViewUrl in src/lib/team.ts.
--
-- This file is idempotent. If the bucket already exists (created via the
-- dashboard), the INSERT is a no-op and the live configuration is preserved.
-- The policies are dropped and recreated so they are always correct.
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('pitch-decks', 'pitch-decks', false, 52428800)  -- 50 MB, matches MAX_FILE_SIZE_MB
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Per-user policies. Objects are stored at "<user_id>/<timestamp>-<name>", so the
-- first path segment must equal the caller's uid. Without these policies no
-- authenticated user can write, and nothing here is scoped to a folder.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users upload own pitch deck" ON storage.objects;
CREATE POLICY "Users upload own pitch deck"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'pitch-decks'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

DROP POLICY IF EXISTS "Users read own pitch deck" ON storage.objects;
CREATE POLICY "Users read own pitch deck"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'pitch-decks'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

DROP POLICY IF EXISTS "Users replace own pitch deck" ON storage.objects;
CREATE POLICY "Users replace own pitch deck"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'pitch-decks'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'pitch-decks'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

DROP POLICY IF EXISTS "Users delete own pitch deck" ON storage.objects;
CREATE POLICY "Users delete own pitch deck"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'pitch-decks'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );

-- Note for whoever deploys this: on an EXISTING project where the bucket was
-- created by hand as public, this migration does NOT flip it back to private
-- (ON CONFLICT DO NOTHING). That is deliberate — flipping visibility on a live
-- bucket would silently break any pitch deck links already handed out. If the
-- bucket is public, getPublicUrl still works and the client falls back to it.
--
-- To make an existing bucket private, run by hand:
--   UPDATE storage.buckets SET public = false WHERE id = 'pitch-decks';
--
-- Organizers who need to download every submission should use a service-role
-- key or a signed URL generated server-side, never anon access.