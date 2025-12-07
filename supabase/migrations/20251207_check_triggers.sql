-- DIAGNOSTIC REPORT
-- Run this to check the health of the trigger system

-- 1. List all triggers on auth.users
select 
    event_object_schema as table_schema,
    event_object_table as table_name,
    trigger_name,
    action_timing,
    event_manipulation as event,
    action_statement as definition
from information_schema.triggers
where event_object_table = 'users'
and event_object_schema = 'auth';

-- 2. Check User Counts (Auth vs Public)
select 'auth.users' as table_name, count(*) as count from auth.users
union all
select 'public.users' as table_name, count(*) as count from public.users;

-- 3. Check most recent auth user (to see if metadata is saved)
select id, email, created_at, raw_user_meta_data 
from auth.users 
order by created_at desc 
limit 3;

-- 4. Check most recent debug logs again
select * from public.debug_logs order by created_at desc limit 5;
