-- Function to check daily job limit
CREATE OR REPLACE FUNCTION check_daily_job_limit()
RETURNS TRIGGER AS $$
DECLARE
    job_count INTEGER;
    user_role TEXT;
BEGIN
    -- Get user role
    SELECT role INTO user_role FROM users WHERE uid = NEW.created_by;

    -- If admin, skip limit
    IF user_role = 'admin' THEN
        RETURN NEW;
    END IF;

    -- Count jobs created by this user today
    SELECT COUNT(*)
    INTO job_count
    FROM jobs
    WHERE created_by = NEW.created_by
      AND created_at >= CURRENT_DATE
      AND created_at < CURRENT_DATE + INTERVAL '1 day';

    -- Check if limit is reached (allow max 10)
    IF job_count >= 10 THEN
        RAISE EXCEPTION 'Günlük görev oluşturma limitine (10) ulaştınız.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before insert
DROP TRIGGER IF EXISTS tr_check_daily_job_limit ON jobs;

CREATE TRIGGER tr_check_daily_job_limit
BEFORE INSERT ON jobs
FOR EACH ROW
EXECUTE FUNCTION check_daily_job_limit();
