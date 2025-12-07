-- SANITY SINK
-- This removes ALL previous triggers and installs a "Dumb" logger.
-- If this table remains empty after signup, Supabase Auth is NOT firing triggers on this database.

-- 1. Create Sink Table (No RLS, Public Writability)
create table if not exists public.signup_sink (
    id serial primary key,
    email text,
    created_at timestamptz default now()
);
alter table public.signup_sink disable row level security;
grant insert, select on public.signup_sink to anon, authenticated, service_role, postgres;

-- 2. Drop OLD Triggers cleanup
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.handle_new_user_debug();

-- 3. Create SIMPLEST Function
create or replace function public.log_to_sink()
returns trigger as $$
begin
    insert into public.signup_sink (email) values (new.email);
    return new;
end;
$$ language plpgsql security definer;

-- 4. Attach Trigger
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.log_to_sink();

-- 5. Restore User Creation (Minimal) attached to same trigger?
-- No, let's keep it SEPARATE or integrated. Ideally integrated.
-- Let's add the basic user insert back here too, so the user isn't broken.
create or replace function public.handle_new_user()
returns trigger as $$
begin
    -- 1. Log to Sink (Proof of Life)
    insert into public.signup_sink (email) values (new.email);

    -- 2. Create User (Best Effort)
    insert into public.users (uid, email, full_name, role, account_status)
    values (
        new.id, 
        new.email, 
        new.raw_user_meta_data->>'full_name',
        'free',
        'active'
    )
    on conflict (uid) do nothing;
    
    return new;
exception when others then
    -- Log failure to sink
    insert into public.signup_sink (email) values ('FAILED: ' || SQLERRM);
    return new;
end;
$$ language plpgsql security definer;

-- Re-point trigger to the main function
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
