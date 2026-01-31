
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Lock } from 'lucide-react';
import { recordTypes } from '@/data/recordTypes';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppState } from '@/contexts/AppStateContext';

interface OrderSummaryProps {
  onSubmitOrder: () => void;
}

const OrderSummary = ({ onSubmitOrder }: OrderSummaryProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, saveStateBeforeLogin } = useAppState();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const calculateTotal = () => {
    return state.selectedRecords.reduce((total, recordId) => {
      const record = recordTypes.find(r => r.id === recordId);
      return total + (record ? parseFloat(record.price.replace('$', '')) : 0);
    }, 0);
  };

  const handlePaymentClick = async () => {
    if (!user) {
      saveStateBeforeLogin();
      navigate('/login', { state: { from: location } });
      return;
    }

    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);
      await onSubmitOrder();
    } catch (error) {
      console.error('Order submission failed:', error);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Cart
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {state.selectedRecords.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No items in cart</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {state.selectedRecords.map((recordId) => {
                const record = recordTypes.find(r => r.id === recordId);
                if (!record) return null;

                return (
                  <div key={recordId} className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                    <div className="flex items-center gap-3">
                      <record.icon className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-200 text-sm">{record.title}</span>
                    </div>
                    <span className="text-white font-semibold">{record.price}</span>
                  </div>
                );
              })}
            </div>

            <Separator className="bg-slate-600" />

            <div className="flex justify-between items-center text-lg">
              <span className="text-white font-semibold">Total</span>
              <span className="text-blue-400 font-bold">${calculateTotal().toFixed(2)}</span>
            </div>
          </>
        )}

        <Button
          onClick={handlePaymentClick}
          disabled={state.selectedRecords.length === 0 || !state.inmateId.trim() || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg disabled:opacity-50"
        >
          {isProcessing ? (
            'Processing...'
          ) : !user ? (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Sign In to Continue
            </>
          ) : state.selectedRecords.length === 0 ? (
            'Add items to cart'
          ) : (
            `Pay $${calculateTotal().toFixed(2)}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
