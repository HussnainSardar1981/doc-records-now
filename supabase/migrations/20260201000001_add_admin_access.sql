-- Migration: Add admin/free access functionality
-- Description: Allow specific users to access all records without payment
-- Date: 2026-02-01

-- ============================================================================
-- 1. CREATE/UPDATE PROFILES TABLE
-- ============================================================================

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add columns safely (in case table already exists)
DO $$
BEGIN
  -- Add has_free_access column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'has_free_access'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN has_free_access BOOLEAN DEFAULT false;
  END IF;

  -- Add is_admin column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_free_access ON public.profiles(has_free_access);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- ============================================================================
-- 2. CREATE FUNCTION TO AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, has_free_access, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email = 'catfishcornerexp@gmail.com', -- Auto-grant free access to this email
    NEW.email = 'catfishcornerexp@gmail.com'  -- Auto-grant admin to this email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 3. GRANT FREE ACCESS TO EXISTING USER (if already signed up)
-- ============================================================================
-- This will work if the user already exists
INSERT INTO public.profiles (id, email, has_free_access, is_admin)
SELECT
  id,
  email,
  true as has_free_access,
  true as is_admin
FROM auth.users
WHERE email = 'catfishcornerexp@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  has_free_access = true,
  is_admin = true;

-- ============================================================================
-- 4. UPDATE RLS POLICIES TO ALLOW FREE ACCESS USERS
-- ============================================================================

-- Policy for phone_records (updated)
DROP POLICY IF EXISTS "Users can view purchased phone records" ON public.phone_records;
CREATE POLICY "Users can view purchased phone records" ON public.phone_records
FOR SELECT USING (
  -- Check if user has free access
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.has_free_access = true
  )
  OR
  -- OR check if they purchased
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.user_id = auth.uid()
    AND orders.phone_record_id = phone_records.id
    AND orders.payment_status = 'paid'
    AND orders.records_unlocked = true
  )
);

-- Policy for visitation_records (updated)
DROP POLICY IF EXISTS "Users can view purchased visitor records" ON public.visitation_records;
CREATE POLICY "Users can view purchased visitor records" ON public.visitation_records
FOR SELECT USING (
  -- Check if user has free access
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.has_free_access = true
  )
  OR
  -- OR check if they purchased
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.user_id = auth.uid()
    AND orders.visitor_record_id = visitation_records.id
    AND orders.payment_status = 'paid'
    AND orders.records_unlocked = true
  )
);

-- ============================================================================
-- 5. UPDATE TRIGGER FOR PROFILES
-- ============================================================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
