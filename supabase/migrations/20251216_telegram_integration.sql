-- Create table for storing OTP link codes
create table public.telegram_link_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(uid) on delete cascade,
  code text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz default now()
);

-- Index for faster lookup
create index telegram_link_codes_user_id_idx on public.telegram_link_codes(user_id);

-- Update users table with Telegram fields
alter table public.users 
add column telegram_chat_id text,
add column telegram_notifications_enabled boolean default false,
add column telegram_connected_at timestamptz;

-- Security: Enable RLS on new table
alter table public.telegram_link_codes enable row level security;

-- Policy: Only service role (backend) can do anything with link codes
-- Users should never directly read/write this table via client SDK
create policy "Service role only" on public.telegram_link_codes
  as permissive
  for all
  to service_role
  using (true)
  with check (true);

-- User table RLS update (if needed, though users can usually update own row)
-- Ensure users can update 'telegram_notifications_enabled' but 'telegram_chat_id' 
-- should generally be protected or managed via backend. 
-- Existing policies likely cover 'update own usage', so we might not need extra RLS 
-- if the backend uses service_role key to update chat_id.
