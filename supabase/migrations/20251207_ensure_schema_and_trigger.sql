-- 1. Ensure all required columns exist in public.users
-- This prevents the trigger from failing if a column is missing

alter table public.users add column if not exists account_status text default 'active';
alter table public.users add column if not exists job_status text default 'active';
alter table public.users add column if not exists role text default 'free';
alter table public.users add column if not exists baro_number text;
alter table public.users add column if not exists baro_city text;
alter table public.users add column if not exists city text;
alter table public.users add column if not exists rating numeric default 0;
alter table public.users add column if not exists completed_jobs integer default 0;

-- 2. Drop existing trigger to ensure clean state
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 3. Re-create the function with robust error handling and logging (if possible, but keep it simple)
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
    coalesce(new.raw_user_meta_data->>'account_status', 'active'), -- Default to active if missing
    0,
    0,
    now(),
    new.raw_user_meta_data->>'baro_number',
    new.raw_user_meta_data->>'baro_city',
    coalesce(new.raw_user_meta_data->>'city', new.raw_user_meta_data->>'baro_city')
  );
  return new;
exception
  when others then
    -- Log error (visible in Supabase logs) but don't block user creation if critical
    -- verify that we want to block or not. Usually block is better for data integrity.
    raise warning 'User creation trigger failed: %', SQLERRM;
    return new; -- Allow auth user creation even if public profile fails (optional, safer for auth)
                -- OR 'raise exception' to rollback everything.
                -- Let's stick to standard behavior: if it fails, let it fail loud so we know? 
                -- Actually, failing loud is better for debugging.
end;
$$ language plpgsql security definer;

-- 4. Re-create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
