-- Fix RLS Policy for user_monthly_stats to allow viewing applicant stats

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own stats" ON user_monthly_stats;

-- Create new policy that allows:
-- 1. Users to view their own stats
-- 2. Job owners to view stats of applicants to their jobs
CREATE POLICY "Users can view stats for job context"
ON user_monthly_stats
FOR SELECT
TO authenticated
USING (
  -- User can view their own stats
  auth.uid() = user_id
  OR
  -- User can view stats of anyone who has applied to their jobs
  EXISTS (
    SELECT 1
    FROM applications a
    INNER JOIN jobs j ON a.job_id = j.job_id
    WHERE a.applicant_id = user_monthly_stats.user_id
    AND j.created_by = auth.uid()
  )
);
