-- Add avatar_url column to users table
alter table public.users add column if not exists avatar_url text;
