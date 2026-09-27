
/*
# Fix infinite recursion in profiles RLS policies

Root cause:
  - profiles_read_own_or_admin policy has an inline subquery
    `EXISTS (SELECT 1 FROM profiles p WHERE ...)` which causes
    infinite recursion.
  - is_admin() is SECURITY DEFINER but doesn't explicitly bypass RLS.

Fix:
  1. Recreate is_admin() with SET row_security = off.
  2. Drop the recursive policy and admin_all_profiles.
  3. Recreate clean non-recursive policies.
*/

-- 1. Recreate is_admin() with RLS bypass
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET row_security = off
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Drop the recursive SELECT policy and the FOR ALL admin policy
DROP POLICY IF EXISTS "profiles_read_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "admin_all_profiles" ON public.profiles;

-- 3. Drop existing policies that we will recreate
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_admin" ON public.profiles;

-- 4. Recreate clean policies for profiles
-- Users can read their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (is_admin());

-- Users can insert their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Admins can insert any profile
CREATE POLICY "profiles_insert_admin" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Users can delete their own profile
CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE TO authenticated
  USING (auth.uid() = id);

-- Admins can delete any profile
CREATE POLICY "profiles_delete_admin" ON public.profiles
  FOR DELETE TO authenticated
  USING (is_admin());
