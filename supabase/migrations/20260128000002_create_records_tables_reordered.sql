-- Migration: Create inmate records infrastructure (REORDERED)
-- Description: Add inmates, phone_records, and visitation_records tables + update orders table
-- Date: 2026-01-28
-- Version: Fixed column ordering for RLS policies

-- ============================================================================
-- 1. CREATE INMATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.inmates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_number TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  age TEXT,
  current_location TEXT,
  status TEXT NOT NULL DEFAULT 'In Custody',
  is_dummy BOOLEAN DEFAULT false,
  phone_records_available BOOLEAN DEFAULT false,
  visitor_records_available BOOLEAN DEFAULT false,
  phone_records_available_date DATE,
  visitor_records_available_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inmates_doc_number ON public.inmates(doc_number);
CREATE INDEX IF NOT EXISTS idx_inmates_full_name ON public.inmates(full_name);
CREATE INDEX IF NOT EXISTS idx_inmates_is_dummy ON public.inmates(is_dummy);

ALTER TABLE public.inmates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view inmates" ON public.inmates;
CREATE POLICY "Anyone can view inmates" ON public.inmates FOR SELECT USING (true);

-- ============================================================================
-- 2. UPDATE ORDERS TABLE (BEFORE creating tables that reference it)
-- ============================================================================

-- Add columns using DO block to check existence safely
DO $$
BEGIN
  -- Add inmate_doc_number
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'orders'
    AND column_name = 'inmate_doc_number'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN inmate_doc_number TEXT;
  END IF;

  -- Add phone_record_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'orders'
    AND column_name = 'phone_record_id'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN phone_record_id UUID;
  END IF;

  -- Add visitor_record_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'orders'
    AND column_name = 'visitor_record_id'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN visitor_record_id UUID;
  END IF;

  -- Add records_unlocked
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'orders'
    AND column_name = 'records_unlocked'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN records_unlocked BOOLEAN DEFAULT false;
  END IF;

  -- Add fulfillment_status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'orders'
    AND column_name = 'fulfillment_status'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN fulfillment_status TEXT DEFAULT 'processing';
  END IF;
END $$;

-- Add CHECK constraint separately (in case column already existed without constraint)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'orders_fulfillment_status_check'
  ) THEN
    ALTER TABLE public.orders ADD CONSTRAINT orders_fulfillment_status_check
      CHECK (fulfillment_status IN ('pending', 'processing', 'fulfilled'));
  END IF;
END $$;

-- Add indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_inmate_doc ON public.orders(inmate_doc_number);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON public.orders(fulfillment_status);
CREATE INDEX IF NOT EXISTS idx_orders_phone_record_id ON public.orders(phone_record_id);
CREATE INDEX IF NOT EXISTS idx_orders_visitor_record_id ON public.orders(visitor_record_id);

-- ============================================================================
-- 3. CREATE PHONE RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.phone_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inmate_id UUID REFERENCES public.inmates(id) ON DELETE CASCADE NOT NULL,
  doc_number TEXT NOT NULL,
  call_history JSONB DEFAULT '[]'::jsonb,
  total_calls INTEGER DEFAULT 0,
  total_approved_numbers INTEGER DEFAULT 0,
  raw_data TEXT,
  last_updated DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(inmate_id)
);

CREATE INDEX IF NOT EXISTS idx_phone_records_inmate_id ON public.phone_records(inmate_id);
CREATE INDEX IF NOT EXISTS idx_phone_records_doc_number ON public.phone_records(doc_number);

ALTER TABLE public.phone_records ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. CREATE VISITATION RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.visitation_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inmate_id UUID REFERENCES public.inmates(id) ON DELETE CASCADE NOT NULL,
  doc_number TEXT NOT NULL,
  approved_visitors JSONB DEFAULT '[]'::jsonb,
  visit_history JSONB DEFAULT '[]'::jsonb,
  total_approved_visitors INTEGER DEFAULT 0,
  total_visits INTEGER DEFAULT 0,
  raw_data TEXT,
  last_updated DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(inmate_id)
);

CREATE INDEX IF NOT EXISTS idx_visitation_records_inmate_id ON public.visitation_records(inmate_id);
CREATE INDEX IF NOT EXISTS idx_visitation_records_doc_number ON public.visitation_records(doc_number);

ALTER TABLE public.visitation_records ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. ADD FOREIGN KEY CONSTRAINTS (after both tables exist)
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_phone_record_id_fkey'
  ) THEN
    ALTER TABLE public.orders
    ADD CONSTRAINT orders_phone_record_id_fkey
    FOREIGN KEY (phone_record_id) REFERENCES public.phone_records(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_visitor_record_id_fkey'
  ) THEN
    ALTER TABLE public.orders
    ADD CONSTRAINT orders_visitor_record_id_fkey
    FOREIGN KEY (visitor_record_id) REFERENCES public.visitation_records(id);
  END IF;
END $$;

-- ============================================================================
-- 6. CREATE RLS POLICIES (after orders columns exist)
-- ============================================================================

-- Policy for phone_records
DROP POLICY IF EXISTS "Users can view purchased phone records" ON public.phone_records;
CREATE POLICY "Users can view purchased phone records" ON public.phone_records
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.user_id = auth.uid()
    AND orders.phone_record_id = phone_records.id
    AND orders.payment_status = 'paid'
    AND orders.records_unlocked = true
  )
);

-- Policy for visitation_records
DROP POLICY IF EXISTS "Users can view purchased visitor records" ON public.visitation_records;
CREATE POLICY "Users can view purchased visitor records" ON public.visitation_records
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.user_id = auth.uid()
    AND orders.visitor_record_id = visitation_records.id
    AND orders.payment_status = 'paid'
    AND orders.records_unlocked = true
  )
);

-- ============================================================================
-- 7. HELPER FUNCTIONS & TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_inmates_updated_at ON public.inmates;
CREATE TRIGGER update_inmates_updated_at
  BEFORE UPDATE ON public.inmates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_phone_records_updated_at ON public.phone_records;
CREATE TRIGGER update_phone_records_updated_at
  BEFORE UPDATE ON public.phone_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_visitation_records_updated_at ON public.visitation_records;
CREATE TRIGGER update_visitation_records_updated_at
  BEFORE UPDATE ON public.visitation_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
