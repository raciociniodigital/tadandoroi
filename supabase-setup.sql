
-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_user_id ON public.users(user_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a function to get the current user_id from JWT
CREATE OR REPLACE FUNCTION public.requesting_user_id()
RETURNS TEXT
LANGUAGE SQL STABLE
AS $$
  SELECT nullif(current_setting('request.jwt.claims', true)::jsonb->>'sub', '')
$$;

-- Create RLS policies
-- Allow users to select only their own data
CREATE POLICY "Users can view own data" 
  ON public.users
  FOR SELECT
  USING (user_id = requesting_user_id());

-- Allow users to insert only their own data
CREATE POLICY "Users can insert own data" 
  ON public.users
  FOR INSERT
  WITH CHECK (user_id = requesting_user_id());

-- Allow users to update only their own data
CREATE POLICY "Users can update own data" 
  ON public.users
  FOR UPDATE
  USING (user_id = requesting_user_id());
