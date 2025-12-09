-- Add SMS preference column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS sms_notifications_enabled BOOLEAN DEFAULT true;
