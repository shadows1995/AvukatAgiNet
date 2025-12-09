-- Create the LOGO2 bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('LOGO2', 'LOGO2', true)
on conflict (id) do update set public = true;

-- Enable RLS (Row Level Security) on the bucket
-- Note: 'storage.objects' RLS is usually enabled by default, but policies are needed.

-- 1. Public Read Access (Anyone can view profile photos)
drop policy if exists "Public Access LOGO2" on storage.objects;
create policy "Public Access LOGO2"
  on storage.objects for select
  using ( bucket_id = 'LOGO2' );

-- 2. Authenticated Upload Access (Only logged in users can upload)
drop policy if exists "Authenticated Insert LOGO2" on storage.objects;
create policy "Authenticated Insert LOGO2"
  on storage.objects for insert
  with check ( bucket_id = 'LOGO2' and auth.role() = 'authenticated' );

-- 3. Users can update/delete their own files (Optional but good practice)
-- Assuming file path format is: user_uid/filename
drop policy if exists "Users Manage Own Files LOGO2" on storage.objects;
create policy "Users Manage Own Files LOGO2"
  on storage.objects for all
  using ( bucket_id = 'LOGO2' and auth.uid()::text = (storage.foldername(name))[1] )
  with check ( bucket_id = 'LOGO2' and auth.uid()::text = (storage.foldername(name))[1] );
