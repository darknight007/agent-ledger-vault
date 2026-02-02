-- Fix infinite recursion in user_roles RLS policies
-- The issue: policies were checking user_roles table while applying policies ON user_roles table

-- Step 1: Drop all existing policies on user_roles that cause recursion
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
DROP POLICY IF EXISTS "Authenticated users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;

-- Step 2: Create a helper function that bypasses RLS to check if user is admin
-- This function runs with SECURITY DEFINER which bypasses RLS
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin_role BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = user_id_param AND role = 'admin'
  ) INTO is_admin_role;
  
  RETURN is_admin_role;
END;
$$;

-- Step 3: Create new policies using the helper function (no recursion)

-- Allow users to read their own role (no recursion - just checks user_id)
CREATE POLICY "Users can read own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own role (no recursion - just checks user_id)
CREATE POLICY "Users can insert own role"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to read all roles (uses helper function to avoid recursion)
CREATE POLICY "Admins can read all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Allow admins to insert any role (uses helper function to avoid recursion)
CREATE POLICY "Admins can insert any role"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Allow admins to update roles (uses helper function to avoid recursion)
CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Allow admins to delete roles (uses helper function to avoid recursion)
CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (public.is_admin(auth.uid()));
