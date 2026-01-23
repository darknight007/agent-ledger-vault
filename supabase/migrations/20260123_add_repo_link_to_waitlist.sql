-- Add repo_link column to waitlist table
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS repo_link TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.waitlist.repo_link IS 'Repository link submitted by user for tech cost analysis';
