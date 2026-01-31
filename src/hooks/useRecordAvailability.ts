import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VisitorPreviewItem {
  name: string;
  relationship?: string;
  address?: string;
  phone?: string;
}

export interface PhonePreviewItem {
  dialed_number: string;
  site: string;
  call_count: number;
}

export interface PhonePreview {
  top_numbers: PhonePreviewItem[];
  total_calls: number;
  total_unique_numbers: number;
}

export interface VisitorPreview {
  top_visitors: VisitorPreviewItem[];
  total_visitors: number;
}

export interface RecordAvailability {
  available: boolean;
  available_date: string | null;
  status: 'available' | 'pending' | 'processing';
  preview?: PhonePreview | VisitorPreview | null;
  already_purchased?: boolean;
}

export interface AvailabilityResponse {
  exists: boolean;
  doc_number: string;
  inmate_name?: string;
  is_dummy?: boolean;
  phone_records: RecordAvailability;
  visitor_records: RecordAvailability;
  message: string;
}

export const useRecordAvailability = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = async (docNumber: string): Promise<AvailabilityResponse | null> => {
    if (!docNumber || !docNumber.trim()) {
      setError('DOC number is required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('check-availability', {
        body: { doc_number: docNumber.trim() }
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Failed to check availability');
      }

      if (!data) {
        throw new Error('No response from availability service');
      }

      setLoading(false);
      return data as AvailabilityResponse;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return {
    checkAvailability,
    loading,
    error
  };
};
