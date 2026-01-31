
import { useToast } from '@/hooks/use-toast';
import { RECORD_PRICES, TOAST_MESSAGES } from '@/constants';
import { paymentOptions } from '@/data/paymentOptions';
import { supabase } from '@/integrations/supabase/client';
import { useAppState } from '@/contexts/AppStateContext';

export const useOrderForm = () => {
  const { toast } = useToast();
  const { state } = useAppState();

  const handleOrder = async () => {
    const recordOrders = state.selectedRecords.filter(record => record !== 'feedback');

    if (recordOrders.length > 0 && !state.inmateId.trim()) {
      toast({ ...TOAST_MESSAGES.inmateIdRequired, duration: 3000 });
      return;
    }

    if (recordOrders.length === 0) {
      toast({ ...TOAST_MESSAGES.noRecordsSelected, duration: 3000 });
      return;
    }

    // Determine the actual DOC number to use
    let actualDocNumber = state.inmateId.trim();

    // If inmateId looks like a name (contains letters/spaces), try to get DOC from search results
    if (!/^[0-9]{3,8}$/.test(actualDocNumber)) {
      if (state.searchResults.length === 1) {
        actualDocNumber = state.searchResults[0].docNumber;
        console.log('Using DOC number from search result:', actualDocNumber);
      } else if (state.searchResults.length > 1) {
        toast({
          title: "Multiple Results Found",
          description: "Please enter the specific DOC number from the search results.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      } else {
        toast({
          title: "Invalid DOC Number",
          description: "Please enter a valid DOC number or search for an inmate first.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
    }

    const selectedPayment = paymentOptions.find(p => p.id === state.paymentMethod);
    const total = recordOrders.reduce((sum, recordId) => {
      return sum + (RECORD_PRICES[recordId as keyof typeof RECORD_PRICES] || 0);
    }, 0);

    if (state.paymentMethod === 'stripe' && total > 0) {
      try {
        toast({
          title: "Processing Payment",
          description: "Creating secure payment session...",
          duration: 2000,
        });

        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: {
            selectedRecords: recordOrders,
            inmateId: actualDocNumber
          }
        });

        if (error) {
          throw new Error(error.message || 'Payment processing failed');
        }

        if (!data || !data.url) {
          throw new Error('No checkout URL received from payment service');
        }

        // Open Stripe checkout in a new tab instead of redirecting current window
        const stripeWindow = window.open(data.url, '_blank');
        
        if (!stripeWindow) {
          // Fallback if popup is blocked
          toast({
            title: "Popup Blocked",
            description: "Please allow popups for this site, then try again.",
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Payment Window Opened",
            description: "Complete your payment in the new tab. This page will remain open.",
            variant: "success",
            duration: 3000,
          });
        }
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown payment error';
        toast({
          title: "Payment Error",
          description: `Failed to create payment session: ${errorMessage}`,
          variant: "destructive",
          duration: 3000,
        });
      }
    } else if (total > 0) {
      toast({
        title: "Order Submitted Successfully",
        description: `Your order for ${recordOrders.length} record type(s) has been submitted via ${selectedPayment?.label}. Total: $${total.toFixed(2)}`,
        variant: "success",
        duration: 3000,
      });
    }
  };

  return {
    handleOrder
  };
};
