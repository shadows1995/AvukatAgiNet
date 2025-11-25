-- Function to check for duplicate email or phone
-- Returns JSON object with 'email_exists' and 'phone_exists' booleans
-- SECURITY DEFINER allows this function to bypass RLS and check all users
CREATE OR REPLACE FUNCTION check_duplicate_user(check_email TEXT, check_phone TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  email_found BOOLEAN;
  phone_found BOOLEAN;
  clean_phone TEXT;
BEGIN
  -- Normalize phone input just in case (remove spaces, parens)
  clean_phone := regexp_replace(check_phone, '[\s\(\)]', '', 'g');

  -- Check email
  SELECT EXISTS (
    SELECT 1 FROM users WHERE email = check_email
  ) INTO email_found;

  -- Check phone (both raw and normalized to be safe)
  SELECT EXISTS (
    SELECT 1 FROM users 
    WHERE phone = check_phone 
       OR phone = clean_phone
       OR regexp_replace(phone, '[\s\(\)]', '', 'g') = clean_phone
  ) INTO phone_found;

  RETURN jsonb_build_object(
    'email_exists', email_found,
    'phone_exists', phone_found
  );
END;
$$;
