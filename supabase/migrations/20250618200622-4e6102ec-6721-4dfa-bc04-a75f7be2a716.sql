
-- Create orders table to track user purchases and order details
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  inmate_id TEXT NOT NULL,
  record_types TEXT[] NOT NULL, -- Array of record type IDs
  paid_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  stripe_session_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, refunded
  process_status TEXT NOT NULL DEFAULT 'received', -- received, processing, completed, failed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own orders
CREATE POLICY "Users can view their own orders" 
  ON public.orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for edge functions to insert orders (bypassing RLS with service role)
CREATE POLICY "Edge functions can insert orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for edge functions to update orders (bypassing RLS with service role)
CREATE POLICY "Edge functions can update orders" 
  ON public.orders 
  FOR UPDATE 
  USING (true);

-- Create index on user_id for faster queries
CREATE INDEX idx_orders_user_id ON public.orders(user_id);

-- Create index on created_at for sorting
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
