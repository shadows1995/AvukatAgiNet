-- Enable RLS on ratings table (ensure it is on)
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Drop potentially restrictive SELECT policies
DROP POLICY IF EXISTS "Users can view their own ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can view ratings given to them" ON public.ratings;
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON public.ratings;

-- Create a new, open SELECT policy so anyone can see reviews on profiles
CREATE POLICY "Ratings are viewable by everyone"
ON public.ratings FOR SELECT
USING (true);

-- Ensure authenticated users can still insert/update their own ratings
-- (We assume these exist, but adding them here to be safe if we were resetting everything, 
-- but since I am only dropping specific names, I will just ensure the SELECT is fixed).
