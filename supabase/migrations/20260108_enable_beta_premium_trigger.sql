-- FIX: Enable Beta Premium auto-assignment in trigger
-- This migration updates the trigger to capture is_premium, key fields from signup metadata.

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
    city,
    -- Premium Fields
    is_premium,
    membership_type,
    premium_plan,
    premium_until,
    premium_since
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
    coalesce(new.raw_user_meta_data->>'city', new.raw_user_meta_data->>'baro_city'),
    -- Premium Fields Logic
    (new.raw_user_meta_data->>'is_premium')::boolean,
    new.raw_user_meta_data->>'membership_type',
    new.raw_user_meta_data->>'premium_plan',
    (new.raw_user_meta_data->>'premium_until')::bigint,
    (new.raw_user_meta_data->>'premium_since')::bigint
  )
  on conflict (uid) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    phone = excluded.phone,
    baro_number = excluded.baro_number,
    baro_city = excluded.baro_city,
    city = excluded.city,
    -- Also update premium fields if re-inserting (rare case for signup but safe)
    is_premium = excluded.is_premium,
    membership_type = excluded.membership_type,
    premium_plan = excluded.premium_plan,
    premium_until = excluded.premium_until,
    premium_since = excluded.premium_since;
    
  return new;
exception
  when others then
    -- Log error but succeed to allow auth user creation
    raise warning 'User creation trigger failed: %', SQLERRM;
    return new;
end;
$$ language plpgsql security definer;
