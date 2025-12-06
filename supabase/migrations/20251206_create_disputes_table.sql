-- Create disputes table
create table if not exists public.disputes (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.jobs(id) on delete set null,
  reporter_id uuid references public.users(uid) on delete set null,
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'open' check (status in ('open', 'resolved', 'dismissed'))
);

-- Enable RLS
alter table public.disputes enable row level security;

-- Policies
-- Admin can view all disputes
create policy "Admins can view all disputes"
  on public.disputes for select
  using (
    exists (
      select 1 from public.users
      where users.uid = auth.uid()
      and users.role = 'admin'
    )
  );

-- Users can insert disputes (for jobs they are involved in - optional strictness, but basic auth is good for now)
create policy "Authenticated users can insert disputes"
  on public.disputes for insert
  with check (auth.role() = 'authenticated');

-- Admin can update disputes (e.g. status)
create policy "Admins can update disputes"
  on public.disputes for update
  using (
    exists (
      select 1 from public.users
      where users.uid = auth.uid()
      and users.role = 'admin'
    )
  );
