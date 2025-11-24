-- Debug script for user_monthly_stats

-- 1. Check if table exists and view structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_monthly_stats';

-- 2. Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_monthly_stats';

-- 3. View current data in the table
SELECT * FROM user_monthly_stats;

-- 4. Check if there are any completed jobs
SELECT job_id, title, status, selected_applicant, completed_at 
FROM jobs 
WHERE status = 'completed' 
LIMIT 10;

-- 5. Manually insert test data for a specific user (REPLACE user_id with actual UID)
-- Example: INSERT INTO user_monthly_stats (user_id, month, job_count, total_earnings, jobs_list)
-- VALUES ('YOUR_USER_ID_HERE', '2025-11-01', 3, 4500, '[]'::jsonb);

-- 6. Check if trigger exists
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'trigger_update_monthly_stats';

-- 7. View trigger function
SELECT prosrc 
FROM pg_proc 
WHERE proname = 'update_monthly_stats';
