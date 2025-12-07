-- NUCLEAR DEBUG SCRIPT
-- This script removes all potential blockers for user creation.

-- 1. DROP TRIGGER (The most likely cause of "email not sent")
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. DISABLE RLS (To rule out "Admin Only" restriction hypothesis)
alter table public.users disable row level security;

-- 3. GRANT PERMISSIONS (Ensure connection has rights)
grant all on public.users to postgres, anon, authenticated, service_role;

-- INSTRUCTIONS for USER:
-- 1. Run this script.
-- 2. Try to signup.
-- 3. If it WORKS (Email sent + User created? No, user won't be in DB because trigger is gone, but Email SHOULD send).
-- 4. If Email sends, we confirm the Trigger was the crasher.
