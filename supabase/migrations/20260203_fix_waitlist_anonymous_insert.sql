-- Fix waitlist RLS policies to allow anonymous inserts
-- Issue: 401 error when anonymous users try to join waitlist

-- Step 1: Drop all existing waitlist policies
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can view waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can view waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Admins can view waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.waitlist;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.waitlist;

-- Step 2: Create new policies that explicitly allow anonymous access

-- Allow ANYONE (authenticated or anonymous) to insert into waitlist
CREATE POLICY "Public can join waitlist"
  ON public.waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow only admins to view waitlist entries (using our is_admin function)
CREATE POLICY "Admins can view waitlist"
  ON public.waitlist
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));
