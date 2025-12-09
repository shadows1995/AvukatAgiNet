-- Add dispute_type column to disputes table
alter table public.disputes 
add column if not exists dispute_type text default 'dispute' check (dispute_type in ('dispute', 'suggestion', 'complaint'));

-- existing job_id is already nullable, but we can ensure it if needed
-- alter table public.disputes alter column job_id drop not null;
