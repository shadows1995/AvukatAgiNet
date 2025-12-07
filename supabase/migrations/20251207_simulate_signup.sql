-- MANUAL SIMULATION OF SIGNUP
-- Run this to see if the Database setup is working correctly.

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  fake_email text := 'test_' || floor(random() * 1000)::text || '@example.com';
BEGIN
  -- 1. Simulate Auth User Creation
  -- This requires the role executing this to have permission on auth.users (Service Role / Postgres usually does)
  INSERT INTO auth.users (id, email, raw_user_meta_data, role, aud, created_at, updated_at)
  VALUES (
    new_user_id,
    fake_email,
    '{"full_name": "Test User", "baro_number": "12345"}'::jsonb,
    'authenticated',
    'authenticated',
    now(),
    now()
  );

  RAISE NOTICE 'Simulated Auth User Inserted [%]', fake_email;

  -- 2. Check Generation (We can't select immediately in the same block if it depends on commit, 
  -- but triggers fire within transaction)
END $$;

-- 3. VERIFY
select * from public.debug_logs order by created_at desc limit 5;
select * from public.users order by created_at desc limit 5;
