-- ============================================================
-- Migration: Fix direct_signup phone constraint
-- ============================================================
-- Root cause: The direct_signup function set phone = '' (empty string).
-- The auth.users table has a UNIQUE constraint on phone, which means
-- only ONE user can have phone = ''. Every subsequent signup fails
-- with a 409 error, which browsers report as "TypeError: failed to fetch".
--
-- Fix: Set phone = NULL instead. PostgreSQL UNIQUE constraints allow
-- multiple NULL values (NULL != NULL), so this resolves the conflict.
-- GoTrue handles NULL phone values safely (email-only users have NULL phone).
-- ============================================================

-- Step 1: Clean up existing users with phone = '' to prevent future conflicts
UPDATE auth.users SET phone = NULL WHERE phone = '';

-- Step 2: Drop the existing function first
-- This is required because CREATE OR REPLACE FUNCTION cannot remove
-- parameter defaults that were set on the original function definition.
DROP FUNCTION IF EXISTS direct_signup(text,text,text,text,text,text);

-- Step 3: Recreate with phone = NULL
CREATE OR REPLACE FUNCTION direct_signup(
  p_email TEXT,
  p_password TEXT,
  p_team_name TEXT,
  p_captain_name TEXT,
  p_member2_name TEXT,
  p_member3_name TEXT
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Reject if a confirmed user with this email already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email AND email_confirmed_at IS NOT NULL) THEN
    RAISE EXCEPTION 'Email address already registered';
  END IF;

  -- Delete any unconfirmed user with this email (e.g. from a failed signUp)
  DELETE FROM auth.users WHERE email = p_email;

  -- Create user with email_confirmed_at = now() (bypasses GoTrue's email confirmation)
  -- phone = NULL: allows multiple users (PostgreSQL UNIQUE allows multiple NULLs)
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    phone,
    aud,
    role,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token,
    email_change_confirm_url,
    reconfirmation_token,
    recovery_token,
    reauthentication_token,
    app_metadata,
    user_metadata
  ) VALUES (
    p_email,
    crypt(p_password, gen_salt('bf', 10)),
    now(),
    NULL,
    'authenticated',
    'authenticated',
    now(),
    now(),
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{}'
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
    p_team_name,
    p_captain_name,
    p_member2_name,
    p_member3_name,
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
$$;

-- Step 4: Grant execute to authenticated users (explicit parameter types)
GRANT EXECUTE ON FUNCTION public.direct_signup(text, text, text, text, text, text)
TO authenticated;

-- Verify
SELECT 'Migration complete. direct_signup now uses phone = NULL.' AS status;
