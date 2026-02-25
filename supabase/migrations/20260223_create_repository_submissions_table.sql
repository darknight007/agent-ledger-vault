-- Create dedicated table for repository link submissions
-- This avoids overloading waitlist rows that require name/email.

CREATE TABLE IF NOT EXISTS public.repository_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  repo_link text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_repository_submissions_created_at
  ON public.repository_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_repository_submissions_repo_link
  ON public.repository_submissions (repo_link);

ALTER TABLE public.repository_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit repository links" ON public.repository_submissions;
CREATE POLICY "Public can submit repository links"
  ON public.repository_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view repository submissions" ON public.repository_submissions;
CREATE POLICY "Admins can view repository submissions"
  ON public.repository_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role::text = 'admin'
    )
  );
