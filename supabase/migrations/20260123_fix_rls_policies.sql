-- Fix RLS policies for waitlist table to allow public inserts

-- Drop existing policies on waitlist table
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.waitlist;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON public.waitlist;

-- Create new policies for waitlist table
-- Allow anyone (authenticated or not) to INSERT into waitlist
CREATE POLICY "Anyone can insert into waitlist"
  ON public.waitlist
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to SELECT from waitlist (optional, can be restricted)
CREATE POLICY "Anyone can view waitlist entries"
  ON public.waitlist
  FOR SELECT
  USING (true);

-- Drop and recreate user_roles policies to ensure INSERT works for auth
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Authenticated users can insert roles" ON public.user_roles;

-- Create policies for user_roles table
-- Allow authenticated users to insert their own role
CREATE POLICY "Authenticated users can insert their own role"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to read all roles
CREATE POLICY "Admins can read all roles"
  ON public.user_roles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_roles WHERE role = 'admin'
    )
  );

-- Allow users to read their own role
CREATE POLICY "Users can read own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow admins to update roles
CREATE POLICY "Admins can update user roles"
  ON public.user_roles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_roles WHERE role = 'admin'
    )
  );
