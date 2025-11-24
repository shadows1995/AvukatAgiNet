-- Drop existing insert policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can insert their own notifications" ON notifications;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON notifications;

-- Create a new policy that allows any authenticated user to insert a notification
-- This is necessary because users need to send notifications TO other users (where user_id != auth.uid())
CREATE POLICY "Enable insert for authenticated users only" 
ON notifications 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to read their OWN notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" 
ON notifications 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow users to update (mark as read) their OWN notifications
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" 
ON notifications 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);
