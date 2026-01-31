import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2, ShoppingBag, AlertCircle } from 'lucide-react';
import { useUserOrders } from '@/hooks/useUserOrders';
import { useRecordData } from '@/hooks/useRecordData';
import { PhoneRecordDisplay } from '@/components/PhoneRecordDisplay';
import { VisitorRecordDisplay } from '@/components/VisitorRecordDisplay';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LoadingCard } from '@/components/LoadingCard';

const OrderCard = ({ order }: { order: any }) => {
  const { phoneRecord, visitorRecord, loading } = useRecordData({
    phoneRecordId: order.phone_record_id,
    visitorRecordId: order.visitor_record_id,
    recordsUnlocked: order.records_unlocked
  });

  const [availabilityDates, setAvailabilityDates] = useState<{
    phone_date: string | null;
    visitor_date: string | null;
  }>({ phone_date: null, visitor_date: null });

  useEffect(() => {
    const fetchAvailabilityDates = async () => {
      // Use inmate_doc_number if available, fallback to inmate_id for older orders
      const docNumber = order.inmate_doc_number || order.inmate_id;
      if (!docNumber) return;

      const { data } = await supabase
        .from('inmates')
        .select('phone_records_available_date, visitor_records_available_date')
        .eq('doc_number', docNumber)
        .single();

      if (data) {
        setAvailabilityDates({
          phone_date: data.phone_records_available_date,
          visitor_date: data.visitor_records_available_date
        });
      }
    };

    fetchAvailabilityDates();
  }, [order.inmate_doc_number, order.inmate_id]);

  const hasPhoneRecords = order.record_types.includes('telephone');
  const hasVisitorRecords = order.record_types.includes('visitor');

  const getFulfillmentBadge = () => {
    switch (order.fulfillment_status) {
      case 'fulfilled':
        return <Badge className="bg-green-600">Fulfilled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-600">Processing</Badge>;
      default:
        return <Badge variant="secondary">{order.fulfillment_status}</Badge>;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white mb-2">
              Order for DOC #{order.inmate_doc_number || order.inmate_id}
            </CardTitle>
            <p className="text-slate-400 text-sm">
              Purchased: {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p className="text-slate-400 text-sm">
              Order ID: {order.id.slice(0, 8)}...
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {getFulfillmentBadge()}
            <span className="text-blue-400 font-semibold">
              ${order.paid_amount.toFixed(2)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="ml-2 text-slate-300">Loading records...</span>
          </div>
        )}

        {!loading && hasPhoneRecords && (
          <PhoneRecordDisplay
            record={phoneRecord}
            isUnlocked={order.records_unlocked && !!order.phone_record_id}
            fulfillmentStatus={order.fulfillment_status}
            availableDate={availabilityDates.phone_date}
            docNumber={order.inmate_doc_number || order.inmate_id}
          />
        )}

        {!loading && hasVisitorRecords && (
          <VisitorRecordDisplay
            record={visitorRecord}
            isUnlocked={order.records_unlocked && !!order.visitor_record_id}
            fulfillmentStatus={order.fulfillment_status}
            availableDate={availabilityDates.visitor_date}
            docNumber={order.inmate_doc_number || order.inmate_id}
          />
        )}

        {order.fulfillment_status === 'processing' && (
          <Alert className="bg-blue-900/20 border-blue-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-blue-200">
              Your records are being manually processed. We'll notify you via email when they're ready.
            </AlertDescription>
          </Alert>
        )}

        {order.fulfillment_status === 'pending' && !order.records_unlocked && (
          <Alert className="bg-yellow-900/20 border-yellow-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-yellow-200">
              Your records are pending availability. Check back soon or we'll email you when ready.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const MyRecords = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { orders, loading, error } = useUserOrders();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col">
        <Header />
        <div className="container mx-auto px-6 py-12 flex-1">
          <Alert className="bg-red-900/20 border-red-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              Please log in to view your records.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => navigate('/login')}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Log In
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col">
      <Header />
      <div className="container mx-auto px-6 py-12 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8" />
            My Records
          </h1>
          <p className="text-slate-300">View and access your purchased inmate records</p>
        </div>

        {loading && (
          <div className="space-y-6">
            <LoadingCard rows={4} />
            <LoadingCard rows={4} />
          </div>
        )}

        {error && (
          <Alert className="bg-red-900/20 border-red-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              Error loading orders: {error}
            </AlertDescription>
          </Alert>
        )}

        {!loading && !error && orders.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-12 text-center">
              <ShoppingBag className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">No Orders Yet</h3>
              <p className="text-slate-400 mb-6">
                You haven't purchased any records yet. Start by searching for an inmate.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start Searching
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && orders.length > 0 && (
          <div>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyRecords;
