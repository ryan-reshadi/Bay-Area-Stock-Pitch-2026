-- =============================================================================
-- Fix direct_signup: 42703 undefined_column on auth.users, plus hardening
-- =============================================================================
--
-- PART 1 — why this migration exists
--
-- The previously deployed function was written against a legacy GoTrue schema
-- and could never have succeeded. Five referenced columns do not exist in this
-- project, and the NOT NULL `id` column was omitted entirely. Because Postgres
-- reports only the first error per statement, the bad column list masked the
-- missing `id`, so both had to be corrected together.
--
-- COLUMNS REMOVED (nonexistent in this project's auth.users):
--   email_change_token       -> GoTrue renamed these to email_change_token_new
--                                and email_change_token_current
--   email_change_confirm_url -> not a column on auth.users
--   reconfirmation_token     -> not a column on auth.users
--   app_metadata             -> real column is raw_app_meta_data
--   user_metadata            -> real column is raw_user_meta_data
--
-- COLUMN ADDED:
--   id                       -> uuid NOT NULL with no default; generate it here
--   instance_id              -> conventional zero uuid for single-instance Supabase
--
-- PART 2 — security hardening applied in the same pass
--
-- 1. REMOVED the unconditional `DELETE FROM auth.users WHERE email = p_email`.
--    The function is SECURITY DEFINER with EXECUTE granted to anon, so that
--    DELETE let any anonymous caller destroy and re-create an *unconfirmed*
--    auth.users row (e.g. a pending organizer invite), taking over the account
--    and orphaning its public.teams row. Rejecting any pre-existing row is now
--    handled inside the function; the legitimate cleanup of leftover
--    unconfirmed rows moved to the one-time statement below, where it is no
--    longer reachable by anon.
--
-- 2. Email is normalized with lower(btrim(...)) and every comparison uses
--    lower(email). Previously the guard compared case-sensitively while GoTrue
--    resolves logins with LOWER(email), so `Jane@x.com` and `jane@x.com` each
--    passed the guard and produced two auth.users rows and two teams rows. At
--    sign-in GoTrue returned one arbitrarily, permanently hiding the other
--    team and its uploaded pitch deck.
--
-- 3. Server-side validation added. The previous function trusted the client,
--    which only enforces password length in the browser; the RPC is directly
--    callable with the public anon key and bypassed GoTrue's password policy
--    entirely.
--
-- 4. search_path now lists `extensions` BEFORE `public`. crypt()/gen_salt()
--    are called unqualified and must resolve, but if `public` were searched
--    first and anon held CREATE on it, an attacker-defined crypt() there would
--    be picked up inside this SECURITY DEFINER body and would capture every
--    registrant's plaintext password. pgcrypto lives in `extensions`.
--
-- 5. pgcrypto is now declared explicitly. Without this the function still
--    applied successfully and failed only at call time.
--
-- ACCEPTED RISKS (documented, not fixed here)
--
-- - No proof of email ownership. email_confirmed_at = now() is set for whatever
--   address the caller supplies, so anyone holding the anon key can register an
--   address they do not own. This is deliberate: the competition flow avoids
--   GoTrue signup precisely to sidestep its email rate limit, and no SMTP
--   delivery is configured for this project. Closing this requires either
--   enabling mailer_autoconfirm or sending a verification email, both of which
--   need dashboard/Management API access. With the guard in this function, a
--   squatted address cannot be re-registered, so this is time-sensitive: it is
--   only safe while registration is open to a known, trusted cohort.
--
-- - No rate limiting. bcrypt cost 10 runs per call inside an anon-callable
--   SECURITY DEFINER function, which is a CPU amplification vector. A
--   deliberate in-function throttle was NOT added because it risks locking out
--   legitimate registrants during a burst. The durable fix is an Edge Function
--   that rate-limits before invoking this RPC.
--
-- - "Email address already registered" is distinguishable from other errors,
--   which is an account-enumeration oracle. Kept because a competition needs
--   to tell a legitimate team that their address is taken.
--
-- Token columns are still set to '' rather than left NULL: GoTrue scans them
-- into non-nullable string fields, and empty string avoids a scan failure.
--
-- anon must retain EXECUTE because the visitor has no session yet at signup
-- time.
-- =============================================================================

-- pgcrypto must exist and live in `extensions` for crypt()/gen_salt().
CREATE EXTENSION IF NOT EXISTS pgcrypto SCHEMA extensions;

-- Defence in depth: ensure anon cannot shadow functions in `public`.
REVOKE CREATE ON SCHEMA public FROM anon, authenticated;

-- One-time cleanup of orphaned unconfirmed users, moved out of the anon-callable
-- function. These can only be leftovers from a direct_signup attempt that failed
-- mid-transaction, or from the retired supabase.auth.signUp() flow. Any row that
-- already owns a teams row is preserved, so no real account is destroyed and no
-- email is left permanently blocked.
DELETE FROM auth.users u
WHERE u.email_confirmed_at IS NULL
  AND NOT EXISTS (SELECT 1 FROM public.teams t WHERE t.user_id = u.id);

-- Signature and RETURNS uuid are unchanged from the deployed version:
-- CREATE OR REPLACE cannot change a function's return type.
CREATE OR REPLACE FUNCTION public.direct_signup(
  p_email         text,
  p_password      text,
  p_team_name     text,
  p_captain_name  text,
  p_member2_name  text,
  p_member3_name  text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, extensions, auth, public, pg_temp
AS $function$
DECLARE
  new_user_id uuid;
  v_email     text;
BEGIN
  -- Normalize once. GoTrue lowercases emails on write and matches logins with
  -- LOWER(email), so the RPC must do the same or the duplicate guard can be
  -- bypassed with different casing.
  v_email := lower(btrim(p_email));

  -- Server-side validation. The browser enforces these too, but the RPC is
  -- directly callable with the public anon key and must not trust the client.
  IF v_email IS NULL OR v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' THEN
    RAISE EXCEPTION 'Please enter a valid email address';
  END IF;

  IF char_length(v_email) > 320 THEN
    RAISE EXCEPTION 'Email address is too long';
  END IF;

  IF p_password IS NULL OR octet_length(p_password) < 6 THEN
    RAISE EXCEPTION 'Password must be at least 6 characters';
  END IF;

  IF octet_length(p_password) > 72 THEN
    -- bcrypt silently truncates beyond 72 bytes; reject rather than accept a
    -- password whose tail is not actually protecting the account.
    RAISE EXCEPTION 'Password must be 72 bytes or fewer';
  END IF;

  IF p_team_name IS NULL OR btrim(p_team_name) = '' THEN
    RAISE EXCEPTION 'Team name is required';
  END IF;

  IF p_captain_name IS NULL OR btrim(p_captain_name) = '' THEN
    RAISE EXCEPTION 'Captain name is required';
  END IF;

  IF char_length(btrim(p_team_name)) > 200 OR char_length(btrim(p_captain_name)) > 200 THEN
    RAISE EXCEPTION 'Team and captain names must be 200 characters or fewer';
  END IF;

  IF (p_member2_name IS NOT NULL AND char_length(btrim(p_member2_name)) > 200)
     OR (p_member3_name IS NOT NULL AND char_length(btrim(p_member3_name)) > 200) THEN
    RAISE EXCEPTION 'Member names must be 200 characters or fewer';
  END IF;

  -- Reject if ANY user already holds this address, confirmed or not. This
  -- replaces the old DELETE-based cleanup, which let an anonymous caller
  -- destroy and hijack unconfirmed accounts.
  IF EXISTS (SELECT 1 FROM auth.users WHERE lower(email) = v_email) THEN
    RAISE EXCEPTION 'Email address already registered';
  END IF;

  -- Create user with email_confirmed_at = now() (bypasses GoTrue's email
  -- confirmation). password is hashed here with pgcrypto bcrypt so the hash is
  -- in the exact format GoTrue's bcrypt comparison expects.
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    phone,
    confirmation_token,
    recovery_token,
    email_change,
    email_change_token_new,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    v_email,
    crypt(p_password, gen_salt('bf', 10)),
    now(),
    NULL,
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'captain_name', btrim(p_captain_name),
      'team_name', btrim(p_team_name)
    ),
    now(),
    now()
  )
  RETURNING id INTO new_user_id;

  -- Create the team profile
  INSERT INTO public.teams (
    user_id,
    team_name,
    member1_name,
    member2_name,
    member3_name,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    btrim(p_team_name),
    btrim(p_captain_name),
    nullif(btrim(p_member2_name), ''),
    nullif(btrim(p_member3_name), ''),
    now(),
    now()
  );

  RETURN new_user_id;
EXCEPTION
  WHEN OTHERS THEN
    IF new_user_id IS NOT NULL THEN
      DELETE FROM auth.users WHERE id = new_user_id;
    END IF;
    RAISE;
END;
$function$;

GRANT EXECUTE ON FUNCTION public.direct_signup(
  text, text, text, text, text, text
) TO anon, authenticated;