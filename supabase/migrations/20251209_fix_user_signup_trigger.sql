-- FIX: Ensure all user metadata is correctly captured during signup
-- This migration drops the old trigger and recreates it to ensure all fields (baro, city, phone) are mapped.

-- 1. Ensure columns exist (Idempotent)
alter table public.users add column if not exists baro_number text;
alter table public.users add column if not exists baro_city text;
alter table public.users add column if not exists city text;
alter table public.users add column if not exists phone text;
alter table public.users add column if not exists role text default 'free';
alter table public.users add column if not exists job_status text default 'active';
alter table public.users add column if not exists account_status text default 'active';

-- 2. Drop existing objects to force update
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 3. Create robust function
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
    coalesce(new.raw_user_meta_data->>'account_status', 'active'),
    0,
    0,
    now(),
    new.raw_user_meta_data->>'baro_number',
    new.raw_user_meta_data->>'baro_city',
    coalesce(new.raw_user_meta_data->>'city', new.raw_user_meta_data->>'baro_city')
  )
  on conflict (uid) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    phone = excluded.phone,
    baro_number = excluded.baro_number,
    baro_city = excluded.baro_city,
    city = excluded.city;
    
  return new;
exception
  when others then
    -- Log error but succeed to allow auth user creation
    raise warning 'User creation trigger failed: %', SQLERRM;
    return new;
end;
$$ language plpgsql security definer;

-- 4. Create trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
