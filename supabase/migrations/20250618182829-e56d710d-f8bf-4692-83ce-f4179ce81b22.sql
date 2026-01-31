
-- Create a table for waitlist signups
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one email per state
  UNIQUE(email, state)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public signup)
CREATE POLICY "Anyone can sign up for waitlist" 
  ON public.waitlist 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Create policy to allow anyone to view waitlist count (public read)
CREATE POLICY "Anyone can view waitlist entries" 
  ON public.waitlist 
  FOR SELECT 
  TO public
  USING (true);

-- Add index for better performance on state queries
CREATE INDEX idx_waitlist_state ON public.waitlist(state);
CREATE INDEX idx_waitlist_created_at ON public.waitlist(created_at);
