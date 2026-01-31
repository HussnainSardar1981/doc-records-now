
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SavedOrderState {
  selectedRecords: string[];
  paymentMethod: string;
  inmateId: string;
  timestamp: number;
}

export const useStateRestoration = (
  setSelectedRecords: (records: string[]) => void,
  setPaymentMethod: (method: string) => void,
  setInmateId: (id: string) => void
) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const savedState = localStorage.getItem('orderState');
      if (savedState) {
        try {
          const parsed: SavedOrderState = JSON.parse(savedState);
          // Only restore if the saved state is recent (within 1 hour)
          if (Date.now() - parsed.timestamp < 3600000) {
            setSelectedRecords(parsed.selectedRecords);
            setPaymentMethod(parsed.paymentMethod);
            setInmateId(parsed.inmateId);
            console.log('Order state restored from localStorage');
          }
          // Clean up the saved state
          localStorage.removeItem('orderState');
        } catch (error) {
          console.error('Failed to restore order state:', error);
          localStorage.removeItem('orderState');
        }
      }
    }
  }, [user, setSelectedRecords, setPaymentMethod, setInmateId]);
};
