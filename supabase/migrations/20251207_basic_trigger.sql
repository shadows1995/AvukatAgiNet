-- BASIC LIFE SUPPORT TRIGGER
-- Does the bare minimum to save the user. Failsafe.

-- 1. Reset Triggers
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. Create Minimal Function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (uid, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'free'
  );
  return new;
exception
  when others then
    -- Log error to postgres logs
    raise warning 'Basic trigger failed for %: %', new.email, SQLERRM;
    return new;
end;
$$ language plpgsql security definer;

-- 3. Create Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Ensure RLS allows Admin/Service Role to work, and select existing users
alter table public.users enable row level security;
