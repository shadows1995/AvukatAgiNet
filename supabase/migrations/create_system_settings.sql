-- Create system_settings table for global configuration
create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.system_settings enable row level security;

-- Allow read access to everyone (or just authenticated users if preferred)
create policy "Allow public read access to system_settings"
  on public.system_settings for select
  using (true);

-- Allow write access only to service role (server-side)
-- Admin users might need write access if we implement client-side admin panel logic directly against Supabase,
-- but for now we are using server-side endpoints for admin actions, so service role is enough.
-- However, if the Admin Dashboard uses the client directly, we need a policy for admins.
-- Let's assume server-side updates for safety.

-- Insert initial value for job bot
insert into public.system_settings (key, value)
values ('job_bot_enabled', 'false'::jsonb)
on conflict (key) do nothing;
