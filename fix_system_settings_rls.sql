-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read settings (needed for the bot check)
CREATE POLICY "Enable read access for all users" ON system_settings
    FOR SELECT USING (true);

-- Allow admins to update settings
-- Assuming 'users' table has a 'role' column and 'uid' matches auth.uid()
CREATE POLICY "Enable update for admins" ON system_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.uid = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Allow admins to insert settings (if not exists)
CREATE POLICY "Enable insert for admins" ON system_settings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.uid = auth.uid()
            AND users.role = 'admin'
        )
    );
