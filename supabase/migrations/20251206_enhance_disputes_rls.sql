-- Allow reporters to view their own disputes
create policy "Reporters can view their own disputes"
  on public.disputes for select
  using (auth.uid() = reporter_id);

-- Check if resolution_notes column exists (just in case, though it was in the correct create script)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'disputes' and column_name = 'resolution_notes') then
    alter table public.disputes add column resolution_notes text;
  end if;
end $$;
