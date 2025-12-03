-- 1. Create system_settings table for global configuration
create table if not exists public.system_settings (
  key text primary key,
  value jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for system_settings
alter table public.system_settings enable row level security;

-- Allow read access to everyone
create policy "Allow public read access to system_settings"
  on public.system_settings for select
  using (true);

-- Insert initial value for job bot
insert into public.system_settings (key, value)
values ('job_bot_enabled', 'false'::jsonb)
on conflict (key) do nothing;

-- 2. Add owner_name and owner_phone columns to jobs table if they don't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'owner_name') then
        alter table public.jobs add column owner_name text;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'jobs' and column_name = 'owner_phone') then
        alter table public.jobs add column owner_phone text;
    end if;
end $$;
