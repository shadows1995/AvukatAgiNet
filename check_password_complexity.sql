-- Function to check password complexity
-- Returns TRUE if password meets criteria (min 6 chars, 1 letter, 1 number)
CREATE OR REPLACE FUNCTION check_password_complexity(p_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check length
    IF LENGTH(p_password) < 6 THEN
        RETURN FALSE;
    END IF;

    -- Check for at least one letter
    IF p_password !~ '[A-Za-z]' THEN
        RETURN FALSE;
    END IF;

    -- Check for at least one number
    IF p_password !~ '[0-9]' THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT check_password_complexity('123456'); -- Returns FALSE
-- SELECT check_password_complexity('a12345'); -- Returns TRUE
