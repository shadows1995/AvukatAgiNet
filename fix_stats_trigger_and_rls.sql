-- 1. Fix the function to use selected_applicant instead of assigned_to
CREATE OR REPLACE FUNCTION update_monthly_stats()
RETURNS TRIGGER AS $$
DECLARE
  job_month DATE;
  job_data JSONB;
  target_user_id UUID;
BEGIN
  -- Only proceed if status changed to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    
    -- Use selected_applicant as the target user
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

-- 2. Enable RLS on user_monthly_stats
ALTER TABLE user_monthly_stats ENABLE ROW LEVEL SECURITY;

-- 3. Add RLS Policies
-- Allow users to view their own stats
DROP POLICY IF EXISTS "Users can view their own stats" ON user_monthly_stats;
CREATE POLICY "Users can view their own stats"
ON user_monthly_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to insert their own stats (triggered by their own action)
DROP POLICY IF EXISTS "Users can insert their own stats" ON user_monthly_stats;
CREATE POLICY "Users can insert their own stats"
ON user_monthly_stats
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own stats
DROP POLICY IF EXISTS "Users can update their own stats" ON user_monthly_stats;
CREATE POLICY "Users can update their own stats"
ON user_monthly_stats
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
