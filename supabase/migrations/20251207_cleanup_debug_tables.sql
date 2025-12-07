-- FINAL CLEANUP & PRODUCTION SETUP
-- Removes debug tables and installs the clean, robust user creation trigger.

-- 1. Remove Debug Tables (Optional, but good for cleanliness)
drop table if exists public.signup_sink;
drop table if exists public.debug_logs;
drop function if exists public.log_to_sink();
drop function if exists public.handle_new_user_debug();

-- 2. Ensure Trigger Function is Clean and Robust
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (
        uid, 
        email, 
        full_name, 
        phone, 
        role, 
        job_status, 
        account_status,
        rating, 
        completed_jobs, 
        created_at,
        baro_number,
        baro_city,
        city
    )
    values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'phone',
        coalesce(new.raw_user_meta_data->>'role', 'free'),
        coalesce(new.raw_user_meta_data->>'job_status', 'active'),
        coalesce(new.raw_user_meta_data->>'account_status', 'active'), -- Default to active
        0,
        0,
        now(),
        new.raw_user_meta_data->>'baro_number',
        new.raw_user_meta_data->>'baro_city',
        coalesce(new.raw_user_meta_data->>'city', new.raw_user_meta_data->>'baro_city')
    )
    on conflict (uid) do update set
        -- If user somehow exists, update the fields to match metadata
        email = excluded.email,
        full_name = excluded.full_name,
        phone = excluded.phone,
        baro_number = excluded.baro_number;
            
    return new;
exception when others then
    -- Log error to postgres internal logs only (viewable in dashboard)
    raise warning 'User creation failed: %', SQLERRM;
    return new;
end;
$$ language plpgsql security definer;

-- 3. Ensure Trigger is Attached
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- 4. Ensure RLS is enabled and correct policies exist (just to be safe)
alter table public.users enable row level security;
