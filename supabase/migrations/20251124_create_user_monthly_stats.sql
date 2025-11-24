-- Create table for storing monthly user statistics
CREATE TABLE IF NOT EXISTS user_monthly_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(uid) ON DELETE CASCADE,
  month DATE NOT NULL, -- Stored as the first day of the month (e.g., '2023-11-01')
  job_count INTEGER DEFAULT 0,
  total_earnings NUMERIC DEFAULT 0,
  jobs_list JSONB DEFAULT '[]'::jsonb, -- Array of objects: { job_id, title, fee, completed_at }
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Function to update stats when a job is marked as completed
CREATE OR REPLACE FUNCTION update_monthly_stats()
RETURNS TRIGGER AS $$
DECLARE
  job_month DATE;
  job_data JSONB;
BEGIN
  -- Only proceed if status changed to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    
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
      NEW.assigned_to,
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
  
  -- Handle case where job is un-completed (reverted from completed to something else)
  -- This is complex with JSONB array removal, so for MVP we might skip or handle simpler decrement
  -- For now, we assume jobs go forward to completed.
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_update_monthly_stats ON jobs;
CREATE TRIGGER trigger_update_monthly_stats
AFTER UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_monthly_stats();
