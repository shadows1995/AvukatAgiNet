-- 1. Allow authenticated users to insert notifications for ANY user
-- This is required so the lawyer can notify the job owner.
DROP POLICY IF EXISTS "Users can insert their own notifications" ON notifications;
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON notifications;

CREATE POLICY "Authenticated users can insert notifications"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 2. Allow selected applicant to update the job status
-- This is required so the lawyer can mark the job as completed.
DROP POLICY IF EXISTS "Applicants can update assigned jobs" ON jobs;

CREATE POLICY "Applicants can update assigned jobs"
ON jobs
FOR UPDATE
TO authenticated
USING (auth.uid() = selected_applicant)
WITH CHECK (auth.uid() = selected_applicant);
