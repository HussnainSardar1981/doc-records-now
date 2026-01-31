
-- Update RLS policies for orders table to be more secure
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Edge functions can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Edge functions can update orders" ON public.orders;

-- Create more specific and secure RLS policies
CREATE POLICY "Users can view their own orders" 
  ON public.orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Only allow authenticated users to insert orders with their own user_id
CREATE POLICY "Users can create their own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Only allow service role to update orders (for payment processing)
CREATE POLICY "Service role can update orders"
  ON public.orders
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Add index for better performance on user queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id_created ON public.orders(user_id, created_at DESC);

-- Add constraint to ensure valid payment status
ALTER TABLE public.orders 
ADD CONSTRAINT valid_payment_status 
CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));

-- Add constraint to ensure valid process status  
ALTER TABLE public.orders 
ADD CONSTRAINT valid_process_status 
CHECK (process_status IN ('received', 'processing', 'completed', 'failed'));

-- Add constraint for reasonable amount limits
ALTER TABLE public.orders 
ADD CONSTRAINT reasonable_amount 
CHECK (paid_amount > 0 AND paid_amount <= 1000);
