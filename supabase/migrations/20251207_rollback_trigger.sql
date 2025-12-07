-- EMERGENCY ROLLBACK
-- If the trigger is causing Auth to fail (no email sent), we must disable it to restore basic functionality.

-- 1. Drop the trigger
drop trigger if exists on_auth_user_created on auth.users;

-- 2. Drop the function
drop function if exists public.handle_new_user();

-- User should now be able to sign up (receive email), but public.users table will NOT be populated automatically yet.
-- This confirms if the trigger was the cause of the blockage.
