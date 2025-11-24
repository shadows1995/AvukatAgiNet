-- Fix: Make the function SECURITY DEFINER to bypass RLS
-- This is necessary because the trigger runs when the lawyer completes the job,
-- but it needs to insert stats for the job owner (which RLS would block).

CREATE OR REPLACE FUNCTION update_monthly_stats()
RETURNS TRIGGER 
SECURITY DEFINER -- This runs the function with the privileges of the creator (postgres/admin)
AS $$
DECLARE
  job_month DATE;
  job_data JSONB;
  target_user_id UUID;
BEGIN
  -- Only proceed if status changed to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    
    -- Use selected_applicant as the target user
    -- Wait! The stats should be for the LAWYER (who earned money) or the OWNER (who spent money)?
    -- Looking at the table schema: job_count, total_earnings.
    -- This implies it tracks the LAWYER'S earnings.
    
    -- If it tracks LAWYER'S earnings, then target_user_id should be selected_applicant.
    target_user_id := NEW.selected_applicant;
    
    -- If no applicant is selected, we can't attribute earnings
    IF target_user_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- Determine the month based on completion date, default to current date if null
    job_month := DATE_TRUNC('month', COALESCE(NEW.completed_at, NOW()))::DATE;
    
    -- Prepare job data object
    job_data := jsonb_build_object(
      'job_id', NEW.job_id,
      'title', NEW.title,
      'fee', NEW.offered_fee,
      'completed_at', COALESCE(NEW.completed_at, NOW())
    );

    -- Insert or Update the stats for that user and month
    INSERT INTO user_monthly_stats (user_id, month, job_count, total_earnings, jobs_list)
    VALUES (
      target_user_id,
      job_month,
      1,
      COALESCE(NEW.offered_fee, 0),
      jsonb_build_array(job_data)
    )
    ON CONFLICT (user_id, month) DO UPDATE SET
      job_count = user_monthly_stats.job_count + 1,
      total_earnings = user_monthly_stats.total_earnings + EXCLUDED.total_earnings,
      jobs_list = user_monthly_stats.jobs_list || job_data,
      updated_at = NOW();
      
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure RLS is still enabled but policies are correct
ALTER TABLE user_monthly_stats ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own stats
DROP POLICY IF EXISTS "Users can view their own stats" ON user_monthly_stats;
CREATE POLICY "Users can view their own stats"
ON user_monthly_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Since the function is SECURITY DEFINER, we don't strictly need INSERT/UPDATE policies for the trigger to work,
-- BUT we should keep them restrictive so users can't manually fake their stats.
-- We can actually REMOVE the insert/update policies for users if we want stats to be ONLY managed by the trigger.
DROP POLICY IF EXISTS "Users can insert their own stats" ON user_monthly_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON user_monthly_stats;

-- If we want to be safe, we can leave no INSERT/UPDATE policies for authenticated users,
-- meaning ONLY the system (via triggers/admin) can modify stats. This is safer.
