-- DEBUGGING LOG SYSTEM
-- This allows us to see exactly what happens inside the database during signup

-- 1. Create a logs table (Public, readable by everyone for now for easy debugging)
create table if not exists public.debug_logs (
  id uuid default gen_random_uuid() primary key,
  message text,
  details jsonb,
  created_at timestamp with time zone default now()
);

-- 2. Debug Trigger Function
create or replace function public.handle_new_user_debug()
returns trigger as $$
begin
  -- Log Start
  insert into public.debug_logs (message, details)
  values ('Trigger Started', jsonb_build_object('email', new.email, 'id', new.id));

  begin
    insert into public.users (uid, email, full_name, role, account_status)
    values (
      new.id,
      new.email,
      new.raw_user_meta_data->>'full_name',
      'free',
      'active'
    );
    
    -- Log Success
    insert into public.debug_logs (message, details)
    values ('Insert Success', jsonb_build_object('email', new.email));
    
  exception when others then
    -- Log Error
    insert into public.debug_logs (message, details)
    values ('Insert Failed', jsonb_build_object('error', SQLERRM, 'state', SQLSTATE));
    -- Re-raise to see if Auth fails
    raise warning 'Insert Failed: %', SQLERRM;
  end;

  return new;
end;
$$ language plpgsql security definer;

-- 3. Attach Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user_debug();

-- 4. Enable access to logs
alter table public.debug_logs enable row level security;
create policy "Anyone can read logs" on public.debug_logs for select using (true);
