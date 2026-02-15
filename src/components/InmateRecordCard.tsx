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
import AuthModal from './AuthModal';

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
  const [showAuthModal, setShowAuthModal] = useState(false);

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
      setShowAuthModal(true);
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
      return <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs">Available Now</Badge>;
    } else if (recordAvailability.available_date) {
      const date = new Date(recordAvailability.available_date).toLocaleDateString();
      return <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs">Available {date}</Badge>;
    } else {
      return (
        <div className="text-sm font-medium text-yellow-200 bg-yellow-900/30 px-2 py-1 rounded">
          Records will be available in 2 Weeks. Thanks for your patience.
        </div>
      );
    }
  };

  return (
    <>
    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/20 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-900/20">
      <CardContent className="p-4 space-y-4">
        {/* Inmate Info */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg break-words">{name}</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{docNumber}</span>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
              {age && <span className="whitespace-nowrap">Age {age}</span>}
            </div>
          </div>
          <Badge variant={status === 'In Custody' ? 'destructive' : 'secondary'} className={`flex-shrink-0 text-xs ${status === 'In Custody' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : ''}`}>
            {status}
          </Badge>
        </div>

        {/* Available Records */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-gray-300 text-sm font-medium">Available Records</h4>
            {(availability?.phone_records?.already_purchased || availability?.visitor_records?.already_purchased) && (
              <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs">Already Purchased</Badge>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-2">
              {/* Phone Records */}
              <div className="flex-1">
                <div className="p-3 bg-gradient-to-br from-[#0A1F4A] to-[#000B2E] rounded-lg border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-1.5 rounded-lg">
                      <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Phone Records</div>
                      {availability?.phone_records && (
                        <div className="mt-1">{getAvailabilityBadge(availability.phone_records)}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                    {!availability?.phone_records?.already_purchased && (
                      <span className="text-white font-semibold text-lg">$29.99</span>
                    )}
                    {availability?.phone_records?.already_purchased ? (
                      <Button
                        size="sm"
                        onClick={() => navigate('/my-records', { state: { docNumber, recordType: 'phone' } })}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                      >
                        View Records
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleToggleRecord('telephone')}
                        variant={isPhoneSelected ? 'secondary' : 'default'}
                        className={`w-full sm:w-auto ${isPhoneSelected ? 'bg-green-600 hover:bg-green-700 !text-white' : 'bg-white text-[#000B2E] hover:bg-gray-100'}`}
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
              <div className="flex-1">
                <div className="p-3 bg-gradient-to-br from-[#0A1F4A] to-[#000B2E] rounded-lg border border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/20 p-1.5 rounded-lg">
                      <Users className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">Visitor Records</div>
                      {availability?.visitor_records && (
                        <div className="mt-1">{getAvailabilityBadge(availability.visitor_records)}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                    {!availability?.visitor_records?.already_purchased && (
                      <span className="text-white font-semibold text-lg">$29.99</span>
                    )}
                    {availability?.visitor_records?.already_purchased ? (
                      <Button
                        size="sm"
                        onClick={() => navigate('/my-records', { state: { docNumber, recordType: 'visitor' } })}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                      >
                        View Records
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleToggleRecord('visitor')}
                        variant={isVisitorSelected ? 'secondary' : 'default'}
                        className={`w-full sm:w-auto ${isVisitorSelected ? 'bg-green-600 hover:bg-green-700 !text-white' : 'bg-white text-[#000B2E] hover:bg-gray-100'}`}
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
          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300">Total</span>
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
    <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};
