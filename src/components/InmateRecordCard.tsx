import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hash, MapPin, Phone, Users, Loader2, CreditCard, Lock } from 'lucide-react';
import { useRecordAvailability } from '@/hooks/useRecordAvailability';
import { useAppState } from '@/contexts/AppStateContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrderForm } from '@/hooks/useOrderForm';
import { BlurredRecordPreview } from './BlurredRecordPreview';

interface InmateRecordCardProps {
  name: string;
  docNumber: string;
  location: string;
  status: string;
  age?: string;
}

export const InmateRecordCard = ({ name, docNumber, location, status, age }: InmateRecordCardProps) => {
  const { checkAvailability, loading } = useRecordAvailability();
  const { state, toggleRecordSelection, updateSearchState } = useAppState();
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const { handleOrder } = useOrderForm();
  const [availability, setAvailability] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      const result = await checkAvailability(docNumber);
      if (result) {
        setAvailability(result);
      }
    };
    fetchAvailability();
  }, [docNumber]);

  const handleToggleRecord = (recordType: string) => {
    updateSearchState({ inmateId: docNumber });
    toggleRecordSelection(recordType);
  };

  const isPhoneSelected = state.selectedRecords.includes('telephone') && state.inmateId === docNumber;
  const isVisitorSelected = state.selectedRecords.includes('visitor') && state.inmateId === docNumber;
  const hasSelection = (isPhoneSelected || isVisitorSelected) && state.inmateId === docNumber;

  const calculateTotal = () => {
    let total = 0;
    if (isPhoneSelected) total += 29.99;
    if (isVisitorSelected) total += 29.99;
    return total;
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: currentLocation } });
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);
      await handleOrder();
    } catch (error) {
      console.error('Order failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getAvailabilityBadge = (recordAvailability: any) => {
    if (!recordAvailability) return null;

    if (recordAvailability.available) {
      return <Badge className="bg-green-600 text-xs">Available Now</Badge>;
    } else if (recordAvailability.available_date) {
      const date = new Date(recordAvailability.available_date).toLocaleDateString();
      return <Badge className="bg-yellow-600 text-xs">Available {date}</Badge>;
    } else {
      return (
        <div className="text-xs text-slate-400">
          Records will be available in 1 Week. Thanks for your patience.
        </div>
      );
    }
  };

  return (
    <Card className="bg-slate-700/30 border-slate-600/50">
      <CardContent className="p-4 space-y-4">
        {/* Inmate Info */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-semibold text-lg">{name}</h3>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-300">
              <div className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                <span>{docNumber}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{location}</span>
              </div>
              {age && <span>Age {age}</span>}
            </div>
          </div>
          <Badge variant={status === 'In Custody' ? 'destructive' : 'secondary'}>
            {status}
          </Badge>
        </div>

        {/* Available Records */}
        <div className="border-t border-slate-600 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-slate-300 text-sm font-medium">Available Records</h4>
            {(availability?.phone_records?.already_purchased || availability?.visitor_records?.already_purchased) && (
              <Badge className="bg-emerald-600 text-xs">Already Purchased</Badge>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            </div>
          ) : (
            <div className="space-y-2">
              {/* Phone Records */}
              <div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">Phone Records</div>
                      {availability?.phone_records && (
                        <div className="mt-1">{getAvailabilityBadge(availability.phone_records)}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!availability?.phone_records?.already_purchased && (
                      <span className="text-white font-semibold">$29.99</span>
                    )}
                    {availability?.phone_records?.already_purchased ? (
                      <Button
                        size="sm"
                        onClick={() => navigate('/my-records')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        View Records
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleToggleRecord('telephone')}
                        variant={isPhoneSelected ? 'secondary' : 'default'}
                        className={isPhoneSelected ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {isPhoneSelected ? 'Selected' : 'Select'}
                      </Button>
                    )}
                  </div>
                </div>
                {availability?.phone_records?.preview && !availability?.phone_records?.already_purchased && (
                  <BlurredRecordPreview type="phone" preview={availability.phone_records.preview} />
                )}
              </div>

              {/* Visitor Records */}
              <div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white font-medium">Visitor Records</div>
                      {availability?.visitor_records && (
                        <div className="mt-1">{getAvailabilityBadge(availability.visitor_records)}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!availability?.visitor_records?.already_purchased && (
                      <span className="text-white font-semibold">$29.99</span>
                    )}
                    {availability?.visitor_records?.already_purchased ? (
                      <Button
                        size="sm"
                        onClick={() => navigate('/my-records')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        View Records
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleToggleRecord('visitor')}
                        variant={isVisitorSelected ? 'secondary' : 'default'}
                        className={isVisitorSelected ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {isVisitorSelected ? 'Selected' : 'Select'}
                      </Button>
                    )}
                  </div>
                </div>
                {availability?.visitor_records?.preview && !availability?.visitor_records?.already_purchased && (
                  <BlurredRecordPreview type="visitor" preview={availability.visitor_records.preview} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Checkout Section */}
        {hasSelection && (
          <div className="border-t border-slate-600 pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-300">Total</span>
              <span className="text-white text-xl font-bold">${calculateTotal().toFixed(2)}</span>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : !user ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Sign In to Checkout
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Checkout ${calculateTotal().toFixed(2)}
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
