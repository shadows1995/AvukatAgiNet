-- Add billing info columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS billing_address text,
ADD COLUMN IF NOT EXISTS tc_id text;
