
-- Create health_analyses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.health_analyses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  symptoms text NOT NULL,
  input_type text NOT NULL,
  analysis text NOT NULL,
  recommendation text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.health_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY IF NOT EXISTS "Users can view their own health analyses" 
  ON public.health_analyses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own health analyses" 
  ON public.health_analyses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
