-- Create a function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (
    uid, 
    email, 
    full_name, 
    phone, 
    role, 
    job_status, 
    rating, 
    completed_jobs, 
    created_at,
    baro_number,
    baro_city,
    city
  )
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role', 'free'),
    coalesce(new.raw_user_meta_data->>'job_status', 'active'),
    0,
    0,
    now(),
    new.raw_user_meta_data->>'baro_number',
    new.raw_user_meta_data->>'baro_city',
    new.raw_user_meta_data->>'city'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
