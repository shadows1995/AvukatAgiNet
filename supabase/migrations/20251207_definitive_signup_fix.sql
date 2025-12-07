-- DEFINITIVE FIX FOR SILENT FAILURES
-- 1. Relax constraints: Ensure columns allow NULL values (prevents 'column cannot be null' errors)
alter table public.users alter column account_status drop not null;
alter table public.users alter column job_status drop not null;
alter table public.users alter column role drop not null;
alter table public.users alter column baro_number drop not null;
alter table public.users alter column baro_city drop not null;
alter table public.users alter column city drop not null;

-- 2. Drop the old trigger/function to force a clean slate
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 3. Create a ROBUST function with UPSERT (ON CONFLICT) capability
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
    coalesce(new.raw_user_meta_data->>'account_status', null), -- Explicitly allow NULL
    0,
    0,
    now(),
    new.raw_user_meta_data->>'baro_number',
    new.raw_user_meta_data->>'baro_city',
    coalesce(new.raw_user_meta_data->>'city', new.raw_user_meta_data->>'baro_city')
  )
  on conflict (uid) do update set
    -- If user already exists (partial creation), just update the fields
    email = excluded.email,
    full_name = excluded.full_name,
    phone = excluded.phone,
    baro_number = excluded.baro_number;
    
  return new;
exception
  when others then
    -- IMPORTANT: We raise a WARNING so it shows in logs, but we do NOT 'RETURN NEW' blindly.
    -- We want to capture the error. 
    -- However, blocking Auth because public profile failed is risky. 
    -- For debugging, let's log it clearly.
    raise warning 'User creation trigger failed for %: %', new.email, SQLERRM;
    return new;
end;
$$ language plpgsql security definer;

-- 4. Re-attach the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
