
-- Create a SECURITY DEFINER function to check if an email exists in auth.users.
-- This is used by the login page to detect unknown emails and redirect to signup.
-- It only returns a boolean — no user data is exposed.
CREATE OR REPLACE FUNCTION public.email_exists(check_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE email = check_email
  );
$$;

-- Grant execute to authenticated and anon so the login page (pre-auth) can call it
GRANT EXECUTE ON FUNCTION public.email_exists(text) TO anon;
GRANT EXECUTE ON FUNCTION public.email_exists(text) TO authenticated;
