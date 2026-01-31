import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type PhoneRecord = Tables<'phone_records'>;
type VisitorRecord = Tables<'visitation_records'>;

interface UseRecordDataProps {
  phoneRecordId?: string | null;
  visitorRecordId?: string | null;
  recordsUnlocked: boolean;
}

export const useRecordData = ({ phoneRecordId, visitorRecordId, recordsUnlocked }: UseRecordDataProps) => {
  const [phoneRecord, setPhoneRecord] = useState<PhoneRecord | null>(null);
  const [visitorRecord, setVisitorRecord] = useState<VisitorRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      // Don't fetch if records aren't unlocked
      if (!recordsUnlocked) {
        setPhoneRecord(null);
        setVisitorRecord(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch phone record if ID exists
        if (phoneRecordId) {
          const { data: phoneData, error: phoneError } = await supabase
            .from('phone_records')
            .select('*')
            .eq('id', phoneRecordId)
            .single();

          if (phoneError && phoneError.code !== 'PGRST116') {
            // PGRST116 is "not found" - ignore it, log others
            console.error('Error fetching phone record:', phoneError);
          } else if (phoneData) {
            setPhoneRecord(phoneData);
          }
        }

        // Fetch visitor record if ID exists
        if (visitorRecordId) {
          const { data: visitorData, error: visitorError } = await supabase
            .from('visitation_records')
            .select('*')
            .eq('id', visitorRecordId)
            .single();

          if (visitorError && visitorError.code !== 'PGRST116') {
            console.error('Error fetching visitor record:', visitorError);
          } else if (visitorData) {
            setVisitorRecord(visitorData);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch records';
        setError(errorMessage);
        console.error('Error fetching records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [phoneRecordId, visitorRecordId, recordsUnlocked]);

  return {
    phoneRecord,
    visitorRecord,
    loading,
    error
  };
};
